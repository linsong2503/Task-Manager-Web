import mongoose, { Schema, model } from 'mongoose';
import  toJSON from '../plugins/toJson.plugin.js';
import audit from '../plugins/audit.plugin.js'
import  {tokenTypes}  from '../../config/token.js';

const { SchemaTypes } = mongoose;

const tokenSchema = Schema(
    {
        token: {
            type: String,
            required: true,
            index: true,
        },
        user: {
            type: SchemaTypes.ObjectId,
            ref: 'User',
            required: true,
        },
        type: {
            type: String,
            enum: [tokenTypes.REFRESH, tokenTypes.RESET_PASSWORD, tokenTypes.VERIFY_EMAIL],
            required: true,
        },
        expires: {
            type: Date,
            required: true,
        },
        blacklisted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// add plugin that converts mongoose to json
tokenSchema.plugin(toJSON);
tokenSchema.plugin(audit);
/**
 * @typedef Token
 */
const Token = model('Token', tokenSchema);

export default Token;
