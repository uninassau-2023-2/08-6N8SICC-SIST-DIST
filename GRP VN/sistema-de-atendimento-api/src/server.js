import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import TicketRoutes from "./routes/ticket.routes.js";
import cron from "node-cron";
import Functions from "./utils/functions.js";

export const prisma = new PrismaClient();

async function main() {
  const app = express();
  const port = 3000;

  app.use(express.json());
  app.use(cors());
  app.use("/api/ticket", TicketRoutes);

  app.all("*", (req, res) => {
    res.status(404).json({ error: `Route ${req.originalUrl} not found` });
  });

  app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });

  cron.schedule("0 17 * * *", Functions.deleteData);
}

main().catch((err) => {
  console.error(err);
});
