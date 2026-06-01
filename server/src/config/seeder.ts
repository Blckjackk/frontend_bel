import { AppDataSource } from "./database";
import { User } from "../entities/User";
import { City } from "../entities/City";
import { Feature } from "../entities/Feature";
import { Office } from "../entities/Office";
import { OfficeImage } from "../entities/OfficeImage";
import bcrypt from "bcryptjs";

export async function seedDatabase() {
  try {
    const userRepo = AppDataSource.getRepository(User);
    const cityRepo = AppDataSource.getRepository(City);
    const featureRepo = AppDataSource.getRepository(Feature);
    const officeRepo = AppDataSource.getRepository(Office);
    const imageRepo = AppDataSource.getRepository(OfficeImage);

    // 1. Seed Users
    const userCount = await userRepo.count();
    let adminUser, providerUser, customerUser;

    if (userCount === 0) {
      console.log("🌱 Seeding Users...");
      
      const adminHash = await bcrypt.hash("admin1", 10);
      adminUser = userRepo.create({
        name: "Admin OfficeHub",
        email: "admin1@gmail.com",
        password: adminHash,
        role: "admin"
      });
      await userRepo.save(adminUser);

      const providerHash = await bcrypt.hash("provider", 10);
      providerUser = userRepo.create({
        name: "Office Provider",
        email: "provider@gmail.com",
        password: providerHash,
        role: "provider"
      });
      await userRepo.save(providerUser);

      const customerHash = await bcrypt.hash("belva", 10);
      customerUser = userRepo.create({
        name: "Belva Risma",
        email: "belva@gmail.com",
        password: customerHash,
        role: "customer"
      });
      await userRepo.save(customerUser);
      
      console.log("✅ Users seeded successfully!");
    } else {
      adminUser = await userRepo.findOne({ where: { email: "admin1@gmail.com" } });
      providerUser = await userRepo.findOne({ where: { email: "provider@gmail.com" } });
      customerUser = await userRepo.findOne({ where: { email: "belva@gmail.com" } });
    }

    // 2. Seed Cities
    const cityCount = await cityRepo.count();
    let jakarta, bandung, surabaya, yogyakarta;

    if (cityCount === 0) {
      console.log("🌱 Seeding Cities...");
      
      jakarta = cityRepo.create({
        name: "Jakarta Pusat",
        slug: "jakarta-pusat",
        image: "/assets/images/thumbnails/thumbnails-1.png"
      });
      await cityRepo.save(jakarta);

      bandung = cityRepo.create({
        name: "Bandung",
        slug: "bandung",
        image: "/assets/images/thumbnails/thumbnails-2.png"
      });
      await cityRepo.save(bandung);

      surabaya = cityRepo.create({
        name: "Surabaya",
        slug: "surabaya",
        image: "/assets/images/thumbnails/thumbnails-3.png"
      });
      await cityRepo.save(surabaya);

      yogyakarta = cityRepo.create({
        name: "Yogyakarta",
        slug: "yogyakarta",
        image: "/assets/images/thumbnails/thumbnails-4.png"
      });
      await cityRepo.save(yogyakarta);

      console.log("✅ Cities seeded successfully!");
    } else {
      jakarta = await cityRepo.findOne({ where: { slug: "jakarta-pusat" } });
      bandung = await cityRepo.findOne({ where: { slug: "bandung" } });
      surabaya = await cityRepo.findOne({ where: { slug: "surabaya" } });
      yogyakarta = await cityRepo.findOne({ where: { slug: "yogyakarta" } });
    }

    // 3. Seed Features
    const featureCount = await featureRepo.count();
    let wifi, privacy, freeMove, sustainability, parking, compact;

    if (featureCount === 0) {
      console.log("🌱 Seeding Features...");
      
      wifi = featureRepo.create({ name: "High Speed Wifi", icon: "wifi.svg" });
      await featureRepo.save(wifi);

      privacy = featureRepo.create({ name: "100% Privacy", icon: "security.svg" });
      await featureRepo.save(privacy);

      freeMove = featureRepo.create({ name: "Free Move", icon: "user.svg" });
      await featureRepo.save(freeMove);

      sustainability = featureRepo.create({ name: "Sustainability", icon: "verify.svg" });
      await featureRepo.save(sustainability);

      parking = featureRepo.create({ name: "Parking Space", icon: "location.svg" });
      await featureRepo.save(parking);

      compact = featureRepo.create({ name: "Compact", icon: "clock.svg" });
      await featureRepo.save(compact);

      console.log("✅ Features seeded successfully!");
    } else {
      wifi = await featureRepo.findOne({ where: { name: "High Speed Wifi" } });
      privacy = await featureRepo.findOne({ where: { name: "100% Privacy" } });
      freeMove = await featureRepo.findOne({ where: { name: "Free Move" } });
      sustainability = await featureRepo.findOne({ where: { name: "Sustainability" } });
      parking = await featureRepo.findOne({ where: { name: "Parking Space" } });
      compact = await featureRepo.findOne({ where: { name: "Compact" } });
    }

    // 4. Seed Offices
    const officeCount = await officeRepo.count();
    if (officeCount === 0 && providerUser && jakarta && surabaya) {
      console.log("🌱 Seeding Offices...");

      // Office 1
      const office1 = officeRepo.create({
        city_id: jakarta.id,
        provider_id: providerUser.id,
        name: "Angga Park Central Master Silicon Valley Star Class",
        slug: "angga-park-central-master-silicon-valley-star-class",
        thumbnail: "/assets/images/thumbnails/thumbnails-1.png",
        about: "Nikmati kemudahan sewa ruang kantor berkelas di jantung kota Jakarta Pusat. Didesain dengan tata kelola ramah lingkungan dan fasilitas berteknologi modern untuk mendukung inovasi bisnis skala global Anda.",
        address: "Gedung BWA HQ Lantai 21, Jl. Sudirman No. 210406, Jakarta Pusat",
        price: 28560000,
        duration_type: "20 days",
        is_open: true,
        is_full_booked: false,
        rating: 4.5,
        sales_contacts: [
          {
            name: "Budi Santoso",
            role: "Sales Manager",
            photo: "/assets/images/photos/photo-1.png",
            email: "budi.santoso@example.com",
            phone: "123-456-7890"
          },
          {
            name: "Siti Nurhaliza",
            role: "Sales Representative",
            photo: "/assets/images/photos/photo-2.png",
            email: "siti.nurhaliza@example.com",
            phone: "098-765-4321"
          }
        ]
      });

      // Bind features
      office1.features = [wifi!, privacy!, freeMove!, sustainability!, parking!, compact!];
      const savedOffice1 = await officeRepo.save(office1);

      // Save additional images
      const img1 = imageRepo.create({ office_id: savedOffice1.id, image_path: "/assets/images/thumbnails/thumbnails-1.png" });
      const img2 = imageRepo.create({ office_id: savedOffice1.id, image_path: "/assets/images/thumbnails/thumbnail-details-2.png" });
      await imageRepo.save([img1, img2]);

      // Office 2
      const office2 = officeRepo.create({
        city_id: surabaya.id,
        provider_id: providerUser.id,
        name: "Pondok Pekerja Remote Surabaya",
        slug: "pondok-pekerja-remote-surabaya",
        thumbnail: "/assets/images/thumbnails/thumbnails-3.png",
        about: "Ruang kerja komunal berkonsep asri dan tenang di Surabaya. Dirancang khusus bagi para digital nomad dan remote developer yang mendambakan produktivitas tinggi dengan sentuhan kopi terbaik.",
        address: "Gedung BWA HQ Surabaya Timur No. 10214, Surabaya",
        price: 12000000,
        duration_type: "15 days",
        is_open: true,
        is_full_booked: false,
        rating: 4.8,
        sales_contacts: [
          {
            name: "Ahmad Wijaya",
            role: "Sales Manager",
            photo: "/assets/images/photos/photo-1.png",
            email: "ahmad.wijaya@example.com",
            phone: "121-472-7890"
          },
          {
            name: "Dewi Lestari",
            role: "Sales Representative",
            photo: "/assets/images/photos/photo-2.png",
            email: "dewi.lestari@example.com",
            phone: "098-765-2104"
          }
        ]
      });

      office2.features = [wifi!, privacy!, compact!];
      const savedOffice2 = await officeRepo.save(office2);

      const img3 = imageRepo.create({ office_id: savedOffice2.id, image_path: "/assets/images/thumbnails/thumbnails-3.png" });
      const img4 = imageRepo.create({ office_id: savedOffice2.id, image_path: "/assets/images/thumbnails/thumbnail-details-2.png" });
      await imageRepo.save([img3, img4]);

      console.log("✅ Offices seeded successfully!");
    }

  } catch (error) {
    console.error("❌ Seeding database failed:", error);
  }
}
