import { JsonController, Get, Post, Param, Body } from "routing-controllers";
import { AppDataSource } from "../config/database";
import { City } from "../entities/City";
import { Office } from "../entities/Office";

@JsonController("/cities")
export class CityController {
  @Get()
  async getAllCities() {
    try {
      const cityRepo = AppDataSource.getRepository(City);
      const officeRepo = AppDataSource.getRepository(Office);
      const cities = await cityRepo.find();
      
      const citiesWithCount = [];
      for (const city of cities) {
        const count = await officeRepo.count({ where: { city_id: city.id } });
        citiesWithCount.push({
          ...city,
          officeCount: count
        });
      }
      return citiesWithCount;
    } catch {
      return { error: "Failed to fetch cities" };
    }
  }

  @Get("/:slug")
  async getCityBySlug(@Param("slug") slug: string) {
    try {
      const cityRepo = AppDataSource.getRepository(City);
      const city = await cityRepo.findOne({ where: { slug } });
      if (!city) return { error: "City not found" };
      return city;
    } catch {
      return { error: "Failed to fetch city" };
    }
  }

  @Post()
  async createCity(@Body() body: { name: string; slug: string; image: string }) {
    try {
      const cityRepo = AppDataSource.getRepository(City);
      const city = cityRepo.create(body);
      return await cityRepo.save(city);
    } catch {
      return { error: "Failed to create city" };
    }
  }
}
