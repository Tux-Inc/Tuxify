/*
File Name: common.service.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Common service

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
    BadRequestException,
    ConflictException,
    Injectable,
    InternalServerErrorException,
    Logger,
    LoggerService,
    NotFoundException,
} from "@nestjs/common";
import slugify from "slugify";
import { validate } from "class-validator";
import { Dictionary } from "@mikro-orm/core";
import { EntityRepository } from "@mikro-orm/postgresql";
import { MessageMapper } from "./mappers/message.mapper";
import { isNull, isUndefined } from "./utils/validation.util";

@Injectable()
export class CommonService {
    private readonly loggerService: LoggerService;

    /**
     * The constructor function initializes a new instance of the LoggerService
     * class with the name of the CommonService class.
     */
    constructor() {
        this.loggerService = new Logger(CommonService.name);
    }

    /**
     * The function "validateEntity" is used to validate an entity object and
     * throw a BadRequestException if there are any validation errors.
     * @param {Dictionary} entity - The `entity` parameter is a dictionary object
     * that represents the entity to be validated. It could contain various
     * properties and their corresponding values.
     */
    public async validateEntity(entity: Dictionary): Promise<void> {
        const errors = await validate(entity);
        const messages: string[] = [];

        for (const error of errors) {
            messages.push(...Object.values(error.constraints));
        }

        if (errors.length > 0) {
            throw new BadRequestException(messages.join(",\n"));
        }
    }

    /**
     * The function checks if an entity exists and throws an exception if it is
     * null or undefined.
     * @param {T | null | undefined} entity - The `entity` parameter is of type
     * `T`, which extends the `Dictionary` interface. It can be either `null`,
     * `undefined`, or an object that implements the `Dictionary` interface.
     * @param {string} name - The `name` parameter is a string that represents the
     * name of the entity being checked for existence.
     */
    public checkEntityExistence<T extends Dictionary>(
        entity: T | null | undefined,
        name: string,
    ): void {
        if (isNull(entity) || isUndefined(entity)) {
            throw new NotFoundException(`${name} not found`);
        }
    }

    /**
     * The function saves an entity to a repository, performs validation, and
     * checks for duplicates.
     * @param repo - The `repo` parameter is an instance of `EntityRepository`,
     * which is a repository class used for interacting with a specific entity in
     * a database. It provides methods for persisting, updating, and querying
     * entities.
     * @param {T} entity - The `entity` parameter is an object of type `T`, which
     * is a generic type that extends the `Dictionary` interface.
     * @param [isNew=false] - The `isNew` parameter is a boolean flag that
     * indicates whether the entity being saved is new or already exists in the
     * repository. If `isNew` is `true`, it means the entity is new and needs to
     * be persisted in the repository. If `isNew` is `false`, it means the entity
     */
    public async saveEntity<T extends Dictionary>(
        repo: EntityRepository<T>,
        entity: T,
        isNew = false,
    ): Promise<void> {
        await this.validateEntity(entity);

        if (isNew) {
            repo.persist(entity);
        }

        await this.throwDuplicateError(repo.flush());
    }

    /**
     * The function removes an entity from a repository and throws an internal
     * error if there is an issue.
     * @param repo - The `repo` parameter is an instance of `EntityRepository<T>`,
     * which is a repository class used for interacting with a specific entity
     * type `T`. It provides methods for querying, creating, updating, and
     * deleting entities of type `T` in the database.
     * @param {T} entity - The `entity` parameter is an object of type `T`, which
     * is a generic type that extends the `Dictionary` interface.
     */
    public async removeEntity<T extends Dictionary>(
        repo: EntityRepository<T>,
        entity: T,
    ): Promise<void> {
        await this.throwInternalError(repo.removeAndFlush(entity));
    }

    /**
     * The function `throwDuplicateError` catches errors thrown by a promise and
     * throws a `ConflictException` if the error code is "23505", otherwise it
     * throws a `BadRequestException`.
     * @param promise - The `promise` parameter is a Promise that represents an
     * asynchronous operation. It is expected to resolve with a value of type `T`.
     * @param {string} [message] - The `message` parameter is an optional string
     * that represents the error message to be thrown if a duplicate value is
     * found in the database. If no message is provided, a default message of
     * "Duplicated value in database" will be used.
     * @returns the result of the `promise` if it resolves successfully.
     */
    public async throwDuplicateError<T>(promise: Promise<T>, message?: string) {
        try {
            return await promise;
        } catch (error) {
            this.loggerService.error(error);

            if (error.code === "23505") {
                throw new ConflictException(
                    message ?? "Duplicated value in database",
                );
            }

            throw new BadRequestException(error.message);
        }
    }

    /**
     * The function "throwInternalError" catches any errors thrown by a promise,
     * logs the error, and then throws a new InternalServerErrorException with the
     * original error as the message.
     * @param promise - The `promise` parameter is a Promise object that
     * represents an asynchronous operation. It is expected to resolve to a value
     * of type `T`.
     * @returns a Promise of type T.
     */
    public async throwInternalError<T>(promise: Promise<T>): Promise<T> {
        try {
            return await promise;
        } catch (error) {
            this.loggerService.error(error);
            throw new InternalServerErrorException(error);
        }
    }

    /**
     * The `formatName` function takes a string as input and returns a formatted
     * version of the string with leading and trailing spaces removed, consecutive
     * spaces replaced with a single space, and each word capitalized.
     * @param {string} title - The `title` parameter is a string that represents a
     * title or a name.
     * @returns a formatted version of the input title string.
     */
    public formatName(title: string): string {
        return title
            .trim()
            .replace(/\n/g, " ")
            .replace(/\s\s+/g, " ")
            .replace(/\w\S*/g, (w) => w.replace(/^\w/, (l) => l.toUpperCase()));
    }

    /**
     * The function "generatePointSlug" takes a string as input and returns a
     * slugified version of the string with lowercase letters, dots as
     * replacements for special characters, and certain characters removed.
     * @param {string} str - The `str` parameter is a string that represents the
     * point you want to generate a slug for.
     * @returns a slugified version of the input string.
     */
    public generatePointSlug(str: string): string {
        return slugify(str, {
            lower: true,
            replacement: ".",
            remove: /['_\.\-]/g,
        });
    }

    /**
     * The function generates a message mapper object based on the input message.
     * @param {string} message - The parameter "message" is of type string and
     * represents the message that you want to generate.
     * @returns a new instance of the MessageMapper class, passing the message
     * parameter to its constructor.
     */
    public generateMessage(message: string): MessageMapper {
        return new MessageMapper(message);
    }
}
