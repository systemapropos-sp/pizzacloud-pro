import "dotenv/config";

function required(name: string, defaultValue?: string): string {
  const value = process.env[name];
  if (!value && process.env.NODE_ENV === "production") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value ?? defaultValue ?? "";
}

export const env = {
  appId: required("APP_ID", "pizzacloud"),
  appSecret: required("APP_SECRET", "dev-secret"),
  isProduction: process.env.NODE_ENV === "production",
  databaseUrl: required("DATABASE_URL", "postgresql://localhost:5432/pizzacloud"),
  kimiAuthUrl: required("KIMI_AUTH_URL", "https://kimi-auth.moonshot.cn"),
  kimiOpenUrl: required("KIMI_OPEN_URL", "https://kimi.moonshot.cn"),
  ownerUnionId: process.env.OWNER_UNION_ID ?? "",
};
