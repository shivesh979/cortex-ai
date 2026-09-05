import { ChatGoogleGenerativeAI }
  from "@langchain/google-genai";
import { ChatGroq } from "@langchain/groq"
import dotenv from "dotenv"
dotenv.config()
import { ChatOpenRouter } from "@langchain/openrouter";

// Normalize a pasted API key: strip surrounding quotes/whitespace that would
// otherwise be sent verbatim to the provider and rejected as invalid.
const cleanKey = (key) => {
  if (typeof key !== "string" || key.length === 0) return key;
  const trimmed = key.trim();
  const quoted =
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"));
  return quoted ? trimmed.slice(1, -1) : trimmed;
};

const groqApiKey = cleanKey(process.env.GROQ_API_KEY);

if (groqApiKey) {
  const hasArtifacts = groqApiKey !== process.env.GROQ_API_KEY;
  console.log(
    "[model] GROQ_API_KEY present: yes | " +
      `length=${groqApiKey.length} | ` +
      (groqApiKey.length >= 12
        ? `prefix=${groqApiKey.slice(0, 4)}.. | `
        : "too-short | ") +
      `format(gsk_): ${groqApiKey.startsWith("gsk_") ? "yes" : "no"} | ` +
      `quotes/whitespace stripped: ${hasArtifacts ? "yes" : "no"}`
  );
} else {
  console.warn("[model] GROQ_API_KEY present: NO");
}

const openRouter = new ChatOpenRouter({
  model: "deepseek/deepseek-chat",
  temperature: 0,
  maxTokens:2500
  // other params...
});


export const gemini =
  new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    apiKey: process.env.GOOGLE_API_KEY
  });

let groq;
try {
  groq = new ChatGroq({
    model: "openai/gpt-oss-20b",
    temperature: 0,
    apiKey: groqApiKey,
    maxTokens: undefined,
    maxRetries: 2,
    // other params...
  });
} catch (err) {
  console.error("[model] ChatGroq init failed:", err.message);
  throw err;
}


export const getModel =
  (agent) => {

    switch (agent) {

      case "coding":
        return openRouter;

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

  }