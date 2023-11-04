/*
File Name: app.service.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Service for app

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

import {
    Injectable,
    Logger,
    LoggerService,
    OnModuleDestroy,
    OnModuleInit,
} from "@nestjs/common";
import { MikroORM } from "@mikro-orm/core";
import { ConfigService } from "@nestjs/config";

/* The AppService class is an Injectable class in TypeScript that implements the
OnModuleInit and OnModuleDestroy interfaces, and it is responsible for
initializing and destroying the module, as well as generating and dropping the
database schema if testing is enabled. */
@Injectable()
export class AppService implements OnModuleInit, OnModuleDestroy {
    private readonly loggerService: LoggerService;
    private readonly testing: boolean;

    /**
     * The constructor initializes the orm and configService, and sets the
     * loggerService and testing properties.
     * @param {MikroORM} orm - The `orm` parameter is an instance of the MikroORM
     * library. It is used for database operations and managing database
     * connections.
     * @param {ConfigService} configService - The `configService` parameter is an
     * instance of the `ConfigService` class. It is used to retrieve configuration
     * values for the application. In this case, it is used to get the value of
     * the "testing" configuration property.
     */
    constructor(
        private readonly orm: MikroORM,
        private readonly configService: ConfigService,
    ) {
        this.loggerService = new Logger(AppService.name);
        this.testing = this.configService.get("testing");
    }

    /**
     * The function checks if testing is enabled and if so, logs the start and
     * finish of schema generation.
     */
    public async onModuleInit() {
        if (this.testing) {
            this.loggerService.log("Started generating schema");
            // await this.orm.getSchemaGenerator().createSchema();
            this.loggerService.log("Finished generating schema");
        }
    }

    /**
     * The function `onModuleDestroy` is responsible for dropping the database
     * schema and closing the database connection.
     */
    public async onModuleDestroy() {
        if (this.testing) {
            this.loggerService.log("Started dropping schema");
            // await this.orm.getSchemaGenerator().dropSchema();
            this.loggerService.log("Finished dropping schema");
        }

        this.loggerService.log("Closing database connection");
        await this.orm.close();
        this.loggerService.log("Closed database connection");
    }
}
