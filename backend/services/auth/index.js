import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import router from "./routes/auth.routes.js";
import dns from "node:dns";

dotenv.config();

if (process.env.CUSTOM_DNS_SERVERS) {
  dns.setServers(process.env.CUSTOM_DNS_SERVERS.split(","));
}

const app = express();

app.use(express.json());
app.use(cookieParser());

const port = process.env.PORT || 8001;

app.get("/", (req, res) => {
  res.status(200).json({
    service: "auth",
    status: "ok"
  });
});

app.use("/", router);

app.listen(port, () => {
  connectDB();

  console.log(
    `auth service running on ${port}`
  );
});