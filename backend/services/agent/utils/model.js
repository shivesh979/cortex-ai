import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatGroq } from "@langchain/groq";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Load environment variables
const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
  override: true,
});

// Normalize API keys
const cleanKey = (key) => {
  if (typeof key !== "string" || key.length === 0) {
    return key;
  }

  const trimmed = key.trim();

  const quoted =
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"));

  return quoted ? trimmed.slice(1, -1) : trimmed;
};

// ===============================
// GROQ CONFIGURATION
// ===============================

const groqApiKey = cleanKey(process.env.GROQ_API_KEY);

if (groqApiKey) {
  const hasArtifacts = groqApiKey !== process.env.GROQ_API_KEY;

  console.log(
    "[model] GROQ_API_KEY present: yes | " +
      `length=${groqApiKey.length} | ` +
      (groqApiKey.length >= 12
        ? `prefix=${groqApiKey.slice(0, 4)}.. | `
        : "too-short | ") +
      `format(gsk_): ${
        groqApiKey.startsWith("gsk_") ? "yes" : "no"
      } | ` +
      `quotes/whitespace stripped: ${
        hasArtifacts ? "yes" : "no"
      }`
  );
} else {
  console.warn("[model] GROQ_API_KEY present: NO");
}

// ===============================
// GEMINI MODEL
// ===============================

export const gemini = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GOOGLE_API_KEY,
});

// ===============================
// GROQ MODEL
// ===============================

let groq;

try {
  groq = new ChatGroq({
    model: "openai/gpt-oss-20b",
    temperature: 0,
    apiKey: groqApiKey,
    maxTokens: undefined,
    maxRetries: 2,
  });

  console.log("[model] ChatGroq initialized successfully");
} catch (err) {
  console.error("[model] ChatGroq init failed:", err.message);
  throw err;
}

// ===============================
// MODEL SELECTOR
// ===============================

export const getModel = (agent) => {
  switch (agent) {
    case "coding":
      // OpenRouter removed.
      // Coding now uses Groq.
      return groq;

    case "image":
      return groq;

    case "search":
      return groq;

    case "chat":
      return groq;

    case "vision":
      return gemini;

    default:
      return groq;
  }
};