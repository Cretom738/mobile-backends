import * as Joi from '@hapi/joi';
export const configSchema = Joi.object({
  // app
  NODE_ENV: Joi.string().required(),
  APP_NAME: Joi.string().required(),
  APP_PORT: Joi.string().required(),
  // DB
  DATABASE_URL: Joi.string().required(),
  // redis
  REDIS_URL: Joi.string().required(),
  // jwt
  USER_SESSION_LIMIT: Joi.number().required(),
  JWT_SECRET: Joi.string().required(),
  ACCESS_TOKEN_LIFE_TIME: Joi.number().required(),
  REFRESH_TOKEN_LIFE_TIME: Joi.number().required(),
  // S3 bucket
  BUCKET_NAME: Joi.string().required(),
  ACCESS_KEY_ID: Joi.string().required(),
  SECRET_ACCESS_KEY: Joi.string().required(),
  REGION: Joi.string().required(),
  BUCKET_ENDPOINT: Joi.string().required(),
  IMAGES_ENDPOINT_URL: Joi.string().required(),
  // swagger
  SWAGGER_PASSWORD: Joi.string().optional(),
  SWAGGER_TARGET_SERVER_URL: Joi.string().required(),
});
