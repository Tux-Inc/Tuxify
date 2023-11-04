/*
File Name: config.schema.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Schema for the config file

Copyright (c) 2023 Tux Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the 'Software'), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

import Joi from "joi";

/* The code is defining a validation schema using the Joi library. The schema is
an object that specifies the expected structure and data types of the
configuration file. */
export const validationSchema = Joi.object({
    NESTSV_AUTH_ID: Joi.string().uuid({ version: "uuidv4" }).required(),
    NODE_ENV: Joi.string().required(),
    NESTSV_AUTH_PORT: Joi.number().required(),
    NESTSV_AUTH_DOMAIN: Joi.string().required(),
    NESTSV_AUTH_URL: Joi.string().uri().required(),
    POSTGRES_HOST: Joi.string().required(),
    POSTGRES_PORT: Joi.number().required(),
    POSTGRES_USER: Joi.string().required(),
    POSTGRES_PASSWORD: Joi.string().required(),
    POSTGRES_DB: Joi.string().required(),
    REDIS_HOST: Joi.string().required(),
    JWT_ACCESS_TIME: Joi.number().required(),
    JWT_CONFIRMATION_SECRET: Joi.string().required(),
    JWT_CONFIRMATION_TIME: Joi.number().required(),
    JWT_RESET_PASSWORD_SECRET: Joi.string().required(),
    JWT_RESET_PASSWORD_TIME: Joi.number().required(),
    JWT_REFRESH_SECRET: Joi.string().required(),
    JWT_REFRESH_TIME: Joi.number().required(),
    REFRESH_COOKIE: Joi.string().required(),
    COOKIE_SECRET: Joi.string().required(),
    NESTSV_AUTH_THROTTLE_TTL: Joi.number().required(),
    NESTSV_AUTH_THROTTLE_LIMIT: Joi.number().required(),
    MICROSOFT_CLIENT_ID: Joi.string().optional(),
    MICROSOFT_CLIENT_SECRET: Joi.string().optional(),
    GOOGLE_CLIENT_ID: Joi.string().optional(),
    GOOGLE_CLIENT_SECRET: Joi.string().optional(),
    FACEBOOK_CLIENT_ID: Joi.string().optional(),
    FACEBOOK_CLIENT_SECRET: Joi.string().optional(),
    GH_CLIENT_ID: Joi.string().optional(),
    GH_CLIENT_SECRET: Joi.string().optional(),
});
