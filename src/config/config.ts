export const ENVIRONMENT = process.env.APP_ENV || 'dev'
export const IS_PRODUCTION = ENVIRONMENT === 'production'
export const APP_PORT = Number(process.env.APP_PORT) || 9000
export const APP_PREFIX_PATH = process.env.APP_PREFIX_PATH || '/api'
export const JWT_SECRET = process.env.JWT_SECRET || 'somerandomsecret'
export const JWT_EXPIRE = process.env.JWT_EXPIRE || '1y'
export const DB_SERVER = process.env.DB_SERVER || 'mongodb://localhost:27017/'
export const DB_NAME = process.env.DB_NAME || 'yolo'
export const API_LIMIT_PER_DURATION = parseInt(process.env.API_LIMIT_PER_DURATION || "30");
export const API_LIMIT_DURATION = parseInt(process.env.API_LIMIT_DURATION || "60");
export const REDIS_URL = process.env.REDIS_SERVER || "redis://localhost:6379";

