import dotenv from 'dotenv';

dotenv.config();

interface EnvConfig {
  port: number;
  nodeEnv: string;
  databaseUrl: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  claudeApiKey: string;
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
  corsOrigin: string;
}

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

export const config: EnvConfig = {
  port: parseInt(getEnvVar('PORT', '3000'), 10),
  nodeEnv: getEnvVar('NODE_ENV', 'development'),
  databaseUrl: getEnvVar('DATABASE_URL'),
  jwtSecret: getEnvVar('JWT_SECRET'),
  jwtExpiresIn: getEnvVar('JWT_EXPIRES_IN', '24h'),
  claudeApiKey: getEnvVar('GROQ_API_KEY', ''),
  rateLimitWindowMs: parseInt(getEnvVar('RATE_LIMIT_WINDOW_MS', '3600000'), 10),
  rateLimitMaxRequests: parseInt(getEnvVar('RATE_LIMIT_MAX_REQUESTS', '100'), 10),
  corsOrigin: getEnvVar('CORS_ORIGIN', 'http://localhost:5173'),
};
