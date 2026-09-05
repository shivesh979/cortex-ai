import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import router from "./routes/billing.routes.js";
import dns from "node:dns";

dotenv.config();

if (process.env.CUSTOM_DNS_SERVERS) {
  dns.setServers(process.env.CUSTOM_DNS_SERVERS.split(","));
}

const port = process.env.PORT || 8004;

const app = express();

app.use(express.json());

app.use(helmet());

app.use(morgan("dev"));

app.use("/", router);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Billing Service Running"
  });
});

app.listen(port, () => {
  connectDB();

  console.log(
    `billing service running on ${port}`
  );
});