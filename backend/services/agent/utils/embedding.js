import { GoogleGenerativeAIEmbeddings }
from "@langchain/google-genai";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env"), override: true });

export const embeddings =
new GoogleGenerativeAIEmbeddings({

    apiKey:
    process.env.GOOGLE_API_KEY,

    model:
    "gemini-embedding-001"

});