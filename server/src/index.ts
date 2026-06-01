import "reflect-metadata";
import Koa from "koa";
import bodyParser from "koa-bodyparser";
import Router from "@koa/router";
import { useKoaServer } from "routing-controllers";
import cors from "@koa/cors";
import { AppDataSource } from "./config/database";

const app = new Koa();
const router = new Router();

app.use(cors());
app.use(bodyParser());

useKoaServer(app, {
  routePrefix: "/api",
  controllers: [__dirname + "/controllers/*.ts"],
  middlewares: [__dirname + "/middleware/*.ts"],
  development: process.env.NODE_ENV !== "production",
});

router.get("/health", (ctx) => {
  ctx.body = { status: "ok", timestamp: new Date() };
});

app.use(router.routes());
app.use(router.allowedMethods());

const PORT = process.env.PORT || 5000;

import { seedDatabase } from "./config/seeder";

AppDataSource.initialize()
  .then(async () => {
    console.log("✅ Database connected");
    await seedDatabase();
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log(`📍 API endpoints available at http://localhost:${PORT}/api`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  });