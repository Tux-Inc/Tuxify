/*
File Name: mikro-orm.config.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Configuration for mikro-orm

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

import { LoadStrategy, Options } from "@mikro-orm/core";
import { defineConfig as definePGConfig } from "@mikro-orm/postgresql";
import { defineConfig as defineSqliteConfig } from "@mikro-orm/sqlite";

const baseOptions = {
    entities: ["dist/**/*.entity.js", "dist/**/*.embeddable.js"],
    entitiesTs: ["src/**/*.entity.ts", "src/**/*.embeddable.ts"],
    loadStrategy: LoadStrategy.JOINED,
    allowGlobalContext: true,
};

const config: Options = definePGConfig({
    ...baseOptions,
    password: process.env.POSTGRES_PASSWORD,
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT, 10),
    dbName: process.env.POSTGRES_DB,
    schema: process.env.POSTGRES_DB,
});

export default config;
