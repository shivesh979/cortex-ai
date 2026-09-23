import Redis from "ioredis";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables
dotenv.config();
dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
  override: false,
});
dotenv.config({
  path: path.resolve(__dirname, "../.env"),
  override: false,
});

// Clean environment variable
const cleanValue = (value) => {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }

  return trimmed;
};

let redisUrl = cleanValue(process.env.REDIS_URL);

if (!redisUrl) {
  redisUrl = "redis://localhost:6379";
}

console.log(
  `[redis] Redis configuration detected: ${
    redisUrl.startsWith("rediss://")
      ? "TLS/Upstash"
      : redisUrl.startsWith("redis://")
      ? "standard Redis"
      : "custom"
  }`
);

let redisConfig;

try {
  const parsed = new URL(redisUrl);

  const protocol = parsed.protocol.toLowerCase();

  if (protocol !== "redis:" && protocol !== "rediss:") {
    throw new Error(
      `Unsupported Redis protocol: ${parsed.protocol}`
    );
  }

  redisConfig = {
    host: parsed.hostname,
    port: parsed.port
      ? Number(parsed.port)
      : 6379,

    username: parsed.username
      ? decodeURIComponent(parsed.username)
      : undefined,

    password: parsed.password
      ? decodeURIComponent(parsed.password)
      : undefined,

    maxRetriesPerRequest: 3,

    retryStrategy(times) {
      return Math.min(times * 500, 3000);
    },

    connectTimeout: 10000,

    keepAlive: 10000,

    // Upstash uses TLS through rediss://
    ...(protocol === "rediss:"
      ? {
          tls: {},
        }
      : {}),
  };

  console.log(
    `[redis] Connecting to ${redisConfig.host}:${redisConfig.port} | TLS: ${
      protocol === "rediss:" ? "yes" : "no"
    }`
  );
} catch (error) {
  console.error(
    "[redis] ❌ Invalid REDIS_URL:",
    error.message
  );

  throw error;
}

const redis = new Redis(redisConfig);

redis.on("connect", () => {
  console.log("✅ Redis Connected");
});

redis.on("ready", () => {
  console.log("✅ Redis Ready");
});

redis.on("error", (err) => {
  console.error("❌ Redis Error:", err.message);
});

redis.on("close", () => {
  console.warn("⚠️ Redis Connection Closed");
});

redis.on("reconnecting", () => {
  console.log("🔄 Redis Reconnecting...");
});

export default redis;