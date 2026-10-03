import Joi from "joi";
import { password } from "../common/custom.validation.js";

const register = {
  body: Joi.Joi.object().keys({
    username: Joi.string().required().min(3).max(20).trim(),

    email: Joi.string().required().email().trim().lowercase(),

    password: Joi.string().required().custom(password),

    name: Joi.string().required().trim(),
  }),
};

const login = {
  body: Joi.object().keys({
    username: Joi.string().required().trim(),

    password: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

export default {
  register,
  login,
  logout,
  refreshTokens,
};
