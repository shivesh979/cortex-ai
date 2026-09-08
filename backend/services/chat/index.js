import express from "express";
import dotenv from "dotenv";
import router from "./routes/chat.routes.js";
import connectDB from "./config/db.js";
import dns from "node:dns";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, ".env"), override: true });

if (process.env.CUSTOM_DNS_SERVERS) {
  dns.setServers(process.env.CUSTOM_DNS_SERVERS.split(","));
}

const app = express();

app.use(express.json());

const port = process.env.PORT || 8002;

app.use("/", router);

app.listen(port, () => {
  connectDB();

  console.log(
    `chat service running on ${port}`
  );
});