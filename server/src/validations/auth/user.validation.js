import Joi from "joi"
import { password } from '../common/custom.validation';

const createUser = {
    body: Joi.object().keys({
        username: Joi.string().required(),
        password: Joi.string().required().custom(password),
        email: Joi.string().email().required(),
    }),
};

const getUsers = {
    query: Joi.object().keys({
        username: Joi.string(),
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
        name: Joi.string()
    }),
};

const getUser = {
    params: Joi.object().keys({
    }),
};

const updateUser = {
    params: Joi.object().keys({
    }),
    body: Joi.object()
        .keys({
            username: Joi.string(),
            password: Joi.string().custom(password),
            name: Joi.string().required(),
            email: Joi.string().email().required(),
        })
        .min(1),
};

const deleteUser = {
    params: Joi.object().keys({
    }),
};

export default {
    createUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser,
};
