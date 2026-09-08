import express from "express";
import dotenv from "dotenv";
import dns from "node:dns";
import path from "node:path";
import { fileURLToPath } from "node:url";

import connectDB from "./config/db.js";
import router from "./routes/agent.route.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, ".env"), override: true });

if (process.env.CUSTOM_DNS_SERVERS) {
  dns.setServers(process.env.CUSTOM_DNS_SERVERS.split(","));
}

const app = express();

app.use(express.json());

const port = process.env.PORT || 8003;

app.use("/", router);

app.use((err, req, res, next) => {
  console.error(err);

  if (err.status) {
    return res
      .status(err.status)
      .json(err.data);
  }

  return res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

app.listen(port, () => {
  connectDB();

  console.log(`agent service running on ${port}`);
});