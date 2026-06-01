import { JsonController, Get, Post, Patch, Delete, Param, Body, QueryParam } from "routing-controllers";
import { AppDataSource } from "../config/database";
import { Office } from "../entities/Office";
import { OfficeImage } from "../entities/OfficeImage";
import { Feature } from "../entities/Feature";
import { City } from "../entities/City";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

@JsonController("/offices")
export class OfficeController {
  @Get()
  async getAllOffices(
    @QueryParam("city_id") cityId?: number,
    @QueryParam("search") search?: string,
    @QueryParam("provider_id") providerId?: number
  ) {
    try {
      const officeRepo = AppDataSource.getRepository(Office);
      const query = officeRepo.createQueryBuilder("office")
        .leftJoinAndSelect("office.city", "city")
        .leftJoinAndSelect("office.features", "features")
        .leftJoinAndSelect("office.images", "images")
        .leftJoinAndSelect("office.provider", "provider");

      if (cityId) {
        query.andWhere("office.city_id = :cityId", { cityId });
      }

      if (providerId) {
        query.andWhere("office.provider_id = :providerId", { providerId });
      }

      if (search) {
        query.andWhere("office.name LIKE :search", { search: `%${search}%` });
      }

      return await query.orderBy("office.created_at", "DESC").getMany();
    } catch (err) {
      console.error(err);
      return { error: "Failed to fetch offices" };
    }
  }

  @Get("/:slug")
  async getOfficeBySlug(@Param("slug") slug: string) {
    try {
      const officeRepo = AppDataSource.getRepository(Office);
      const office = await officeRepo.findOne({
        where: { slug },
        relations: ["city", "features", "images", "provider"]
      });
      if (!office) return { error: "Office not found" };
      return office;
    } catch {
      return { error: "Failed to fetch office detail" };
    }
  }

  @Post()
  async createOffice(@Body() body: any) {
    try {
      const officeRepo = AppDataSource.getRepository(Office);
      const imageRepo = AppDataSource.getRepository(OfficeImage);
      const featureRepo = AppDataSource.getRepository(Feature);

      const generatedSlug = body.slug?.trim() ? slugify(body.slug) : slugify(body.name);

      const office = officeRepo.create({
        city_id: Number(body.city_id),
        provider_id: Number(body.provider_id),
        name: body.name,
        slug: generatedSlug,
        thumbnail: body.thumbnail || "/assets/images/thumbnails/thumbnails-1.png",
        about: body.about || "",
        address: body.address || "",
        price: Number(body.price),
        duration_type: body.duration_type || "monthly",
        is_open: body.is_open !== false,
        is_full_booked: Boolean(body.is_full_booked),
        rating: Number(body.rating ?? 4.5),
        sales_contacts: body.sales_contacts || []
      });

      // Load features
      if (Array.isArray(body.feature_names) && body.feature_names.length > 0) {
        const featureEntities = [];
        for (const fName of body.feature_names) {
          let feat = await featureRepo.findOne({ where: { name: fName } });
          if (!feat) {
            feat = featureRepo.create({ name: fName, icon: "verify.svg" });
            await featureRepo.save(feat);
          }
          featureEntities.push(feat);
        }
        office.features = featureEntities;
      }

      const saved = await officeRepo.save(office);

      // Save additional images
      if (Array.isArray(body.images) && body.images.length > 0) {
        const imagesToSave = body.images.map((imgUrl: string) => 
          imageRepo.create({ office_id: saved.id, image_path: imgUrl })
        );
        await imageRepo.save(imagesToSave);
      }

      return await officeRepo.findOne({
        where: { id: saved.id },
        relations: ["city", "features", "images", "provider"]
      });
    } catch (error) {
      console.error(error);
      return { error: "Failed to create office space" };
    }
  }

  @Patch("/:id")
  async updateOffice(@Param("id") id: number, @Body() body: any) {
    try {
      const officeRepo = AppDataSource.getRepository(Office);
      const imageRepo = AppDataSource.getRepository(OfficeImage);
      const featureRepo = AppDataSource.getRepository(Feature);

      const office = await officeRepo.findOne({ where: { id }, relations: ["features", "images"] });
      if (!office) return { error: "Office not found" };

      if (body.name) {
        office.name = body.name;
        office.slug = body.slug?.trim() ? slugify(body.slug) : slugify(body.name);
      }
      if (body.city_id) office.city_id = Number(body.city_id);
      if (body.thumbnail) office.thumbnail = body.thumbnail;
      if (body.about !== undefined) office.about = body.about;
      if (body.address !== undefined) office.address = body.address;
      if (body.price !== undefined) office.price = Number(body.price);
      if (body.duration_type) office.duration_type = body.duration_type;
      if (body.is_open !== undefined) office.is_open = Boolean(body.is_open);
      if (body.is_full_booked !== undefined) office.is_full_booked = Boolean(body.is_full_booked);
      if (body.rating !== undefined) office.rating = Number(body.rating);
      if (body.sales_contacts !== undefined) office.sales_contacts = body.sales_contacts;

      // Handle features update
      if (Array.isArray(body.feature_names)) {
        const featureEntities = [];
        for (const fName of body.feature_names) {
          let feat = await featureRepo.findOne({ where: { name: fName } });
          if (!feat) {
            feat = featureRepo.create({ name: fName, icon: "verify.svg" });
            await featureRepo.save(feat);
          }
          featureEntities.push(feat);
        }
        office.features = featureEntities;
      }

      // Handle additional images update
      if (Array.isArray(body.images)) {
        // Clear old images
        await imageRepo.delete({ office_id: office.id });
        const imagesToSave = body.images.map((imgUrl: string) => 
          imageRepo.create({ office_id: office.id, image_path: imgUrl })
        );
        await imageRepo.save(imagesToSave);
      }

      await officeRepo.save(office);

      return await officeRepo.findOne({
        where: { id: office.id },
        relations: ["city", "features", "images", "provider"]
      });
    } catch (error) {
      console.error(error);
      return { error: "Failed to update office space" };
    }
  }

  @Patch("/:id/fully-booked")
  async toggleFullyBooked(@Param("id") id: number) {
    try {
      const officeRepo = AppDataSource.getRepository(Office);
      const office = await officeRepo.findOne({ where: { id } });
      if (!office) return { error: "Office not found" };

      office.is_full_booked = !office.is_full_booked;
      await officeRepo.save(office);
      return office;
    } catch {
      return { error: "Failed to toggle fully booked status" };
    }
  }

  @Delete("/:id")
  async deleteOffice(@Param("id") id: number) {
    try {
      const officeRepo = AppDataSource.getRepository(Office);
      const office = await officeRepo.findOne({ where: { id } });
      if (!office) return { error: "Office not found" };

      await officeRepo.remove(office);
      return { message: "Office space deleted successfully" };
    } catch {
      return { error: "Failed to delete office space" };
    }
  }
}
