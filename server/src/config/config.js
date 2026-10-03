import "dotenv/config";

import Joi from "joi";

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid("production", "development", "test")
      .required(),

    PORT: Joi.number().default(5005),

    MONGODB_URI: Joi.string()
      .required()
      .description("MongoDB connection URL"),

    JWT_SECRET: Joi.string()
      .required()
      .description("JWT secret key"),

    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
      .default(30)
      .description("Minutes after which access tokens expire"),

    JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
      .default(30)
      .description("Days after which refresh tokens expire"),

    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description("Minutes after which reset password token expires"),

    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description("Minutes after which verify email token expires"),

    SMTP_HOST: Joi.string()
      .description("Server that will send the emails"),

    SMTP_PORT: Joi.number()
      .description("Port to connect to the email server"),

    SMTP_USERNAME: Joi.string()
      .description("Username for email server"),

    SMTP_PASSWORD: Joi.string()
      .description("Password for email server"),

    EMAIL_FROM: Joi.string()
      .description("The from field in emails sent by the app"),

    BASE_URL: Joi.string()
      .description("Base backend URL"),

    BASE_WEB_URL: Joi.string()
      .description("Base frontend URL"),

    EXPO_ACCESS_TOKEN: Joi.string(),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({
    errors: {
      label: "key",
    },
  })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export default {
  env: envVars.NODE_ENV,

  port: envVars.PORT,

  mongoose: {
    url:
      envVars.MONGODB_URI +
      (envVars.NODE_ENV === "test" ? "-test" : ""),

    options: {},
  },

  jwt: {
    secret: envVars.JWT_SECRET,

    accessExpirationMinutes:
      envVars.JWT_ACCESS_EXPIRATION_MINUTES,

    refreshExpirationDays:
      envVars.JWT_REFRESH_EXPIRATION_DAYS,

    resetPasswordExpirationMinutes:
      envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,

    verifyEmailExpirationMinutes:
      envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },

  email: {
    smtp: {
      host: envVars.SMTP_HOST,

      port: envVars.SMTP_PORT,

      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },

    from: envVars.EMAIL_FROM,
  },

  baseUrl: envVars.BASE_URL,

  baseUrlWeb: envVars.BASE_WEB_URL,

  expoAccessToken: envVars.EXPO_ACCESS_TOKEN,
};