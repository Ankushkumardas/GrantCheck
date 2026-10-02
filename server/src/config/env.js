const path = require("path");
const dotenv = require("dotenv");

// Load environment variables from server root or root .env
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
dotenv.config();

const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "5000", 10),
  MONGODB_URI:
    process.env.MONGODB_URI ||
    "mongodb://127.0.0.1:27017/grant_completeness_assistant",
  AI_PROVIDER: (process.env.AI_PROVIDER || "mock").toLowerCase(),
  OLLAMA_BASE_URL: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
  OLLAMA_MODEL: process.env.OLLAMA_MODEL || "llama3.2",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
  GEMINI_MODEL: process.env.GEMINI_MODEL || "gemini-3.5-flash-lite",
  DEMO_EMAIL: process.env.DEMO_EMAIL || "demo@example.com",
  DEMO_PASSWORD: process.env.DEMO_PASSWORD || "demo123",
  JWT_SECRET:
    process.env.JWT_SECRET || "supersecret_demo_jwt_key_grant_check_2026",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
  UPLOAD_DIR: path.resolve(__dirname, "../../uploads"),
};

module.exports = env;
