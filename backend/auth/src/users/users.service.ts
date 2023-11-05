/*
File Name: users.service.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Service for users

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
    UnauthorizedException,
} from "@nestjs/common";
import { compare, hash } from "bcrypt";
import { isInt } from "class-validator";
import { QueryOrder } from "@mikro-orm/core";
import { PasswordDto } from "./dtos/password.dto";
import { UserEntity } from "./entities/user.entity";
import { InjectRepository } from "@mikro-orm/nestjs";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { ChangeEmailDto } from "./dtos/change-email.dto";
import { EntityRepository } from "@mikro-orm/postgresql";
import { CommonService } from "../common/common.service";
import { SLUG_REGEX } from "../common/consts/regex.const";
import { OAuthProvidersEnum } from "./enums/oauth-providers.enum";
import { isNull, isUndefined } from "../common/utils/validation.util";
import { OAuthProviderEntity } from "./entities/oauth-provider.entity";
import { CredentialsEmbeddable } from "./embeddables/credentials.embeddable";

/* The UsersService class is responsible for handling user-related operations such
as creating, finding, updating, and deleting users, as well as managing user
authentication and authorization using OAuth providers. */
@Injectable()
export class UsersService {
    /**
     * The constructor function initializes the repositories for UserEntity and
     * OAuthProviderEntity, as well as the commonService.
     * @param usersRepository - This parameter is an instance of the
     * EntityRepository class for the UserEntity. It is used to perform database
     * operations related to the UserEntity, such as creating, updating, and
     * deleting user records.
     * @param oauthProvidersRepository - The `oauthProvidersRepository` parameter
     * is an instance of the `EntityRepository` class that is used to interact
     * with the `OAuthProviderEntity` entity in the database. It allows you to
     * perform CRUD operations (create, read, update, delete) on the
     * `OAuthProviderEntity` table.
     * @param {CommonService} commonService - The `commonService` parameter is an
     * instance of the `CommonService` class. It is injected into the constructor
     * and can be used to access any methods or properties defined in the
     * `CommonService` class.
     */
    constructor(
        @InjectRepository(UserEntity)
        private readonly usersRepository: EntityRepository<UserEntity>,
        @InjectRepository(OAuthProviderEntity)
        private readonly oauthProvidersRepository: EntityRepository<OAuthProviderEntity>,
        private readonly commonService: CommonService,
    ) {}

    /**
     * The create function creates a new user entity with the provided
     * information, including email, name, and password (optional), and returns
     * the created user.
     * @param {OAuthProvidersEnum} provider - The `provider` parameter is an enum
     * that represents the type of OAuth provider being used. It can have one of
     * the following values:
     * @param {string} email - The email parameter is a string that represents the
     * user's email address.
     * @param {string} name - The `name` parameter is a string that represents the
     * name of the user.
     * @param {string} [password] - The `password` parameter is an optional string
     * that represents the user's password. If a password is provided, it will be
     * hashed using the `hash` function before being stored in the database. If no
     * password is provided, the value "UNSET" will be used instead.
     * @returns a Promise that resolves to a UserEntity object.
     */
    public async create(
        provider: OAuthProvidersEnum,
        email: string,
        name: string,
        password?: string,
    ): Promise<UserEntity> {
        const isConfirmed = provider !== OAuthProvidersEnum.LOCAL;
        const formattedEmail = email.toLowerCase();
        await this.checkEmailUniqueness(formattedEmail);
        const formattedName = this.commonService.formatName(name);
        const user = this.usersRepository.create({
            email: formattedEmail,
            name: formattedName,
            username: await this.generateUsername(formattedName),
            password: isUndefined(password)
                ? "UNSET"
                : await hash(password, 10),
            confirmed: isConfirmed,
            credentials: new CredentialsEmbeddable(isConfirmed),
        });
        await this.commonService.saveEntity(this.usersRepository, user, true);
        await this.createOAuthProvider(provider, user.id);
        return user;
    }

    /**
     * The function `findOneByIdOrUsername` takes an input `idOrUsername` and
     * returns a `UserEntity` based on whether the input is a valid ID or a valid
     * username.
     * @param {string} idOrUsername - The `idOrUsername` parameter is a string
     * that represents either the ID or the username of a user.
     * @returns a Promise that resolves to a UserEntity.
     */
    public async findOneByIdOrUsername(
        idOrUsername: string,
    ): Promise<UserEntity> {
        const parsedValue = parseInt(idOrUsername, 10);

        if (!isNaN(parsedValue) && parsedValue > 0 && isInt(parsedValue)) {
            return this.findOneById(parsedValue);
        }

        if (
            idOrUsername.length < 3 ||
            idOrUsername.length > 106 ||
            !SLUG_REGEX.test(idOrUsername)
        ) {
            throw new BadRequestException("Invalid username");
        }

        return this.findOneByUsername(idOrUsername);
    }

    /**
     * The function findOneById retrieves a user entity by its id and checks if it
     * exists.
     * @param {number} id - The id parameter is a number that represents the
     * unique identifier of a user.
     * @returns a Promise that resolves to a UserEntity object.
     */
    public async findOneById(id: number): Promise<UserEntity> {
        const user = await this.usersRepository.findOne({ id });
        this.commonService.checkEntityExistence(user, "User");
        return user;
    }

    /**
     * The function findOneByUsername retrieves a user entity from the users
     * repository based on the provided username, and throws an unauthorized
     * exception if the forAuth parameter is true.
     * @param {string} username - The username parameter is a string that
     * represents the username of the user you want to find.
     * @param [forAuth=false] - The "forAuth" parameter is a boolean flag that
     * indicates whether the function is being called for authentication purposes
     * or not. If it is set to true, the function will throw an unauthorized
     * exception if the user is not found. If it is set to false, the function
     * will check if the user exists
     * @returns a Promise that resolves to a UserEntity object.
     */
    public async findOneByUsername(
        username: string,
        forAuth = false,
    ): Promise<UserEntity> {
        const user = await this.usersRepository.findOne({
            username: username.toLowerCase(),
        });

        if (forAuth) {
            this.throwUnauthorizedException(user);
        } else {
            this.commonService.checkEntityExistence(user, "User");
        }

        return user;
    }

    /**
     * The function finds a user by their email address and throws an unauthorized
     * exception if the user is not found.
     * @param {string} email - The email parameter is a string that represents the
     * email address of the user you want to find.
     * @returns a Promise that resolves to a UserEntity object.
     */
    public async findOneByEmail(email: string): Promise<UserEntity> {
        const user = await this.usersRepository.findOne({
            email: email.toLowerCase(),
        });
        this.throwUnauthorizedException(user);
        return user;
    }

    /**
     * The function retrieves a user entity from the users repository based on the
     * provided email.
     * @param {string} email - A string representing the email address of the
     * user.
     * @returns The `uncheckedUserByEmail` function is returning a `Promise` that
     * resolves to a `UserEntity` object.
     */
    // necessary for password reset
    public async uncheckedUserByEmail(email: string): Promise<UserEntity> {
        return this.usersRepository.findOne({
            email: email.toLowerCase(),
        });
    }

    /**
     * The function findOneByCredentials finds a user by their ID and version,
     * throws an exception if the user is unauthorized or if the credentials are
     * invalid, and returns the user entity.
     * @param {number} id - The `id` parameter is the unique identifier of the
     * user. It is used to find the user in the database.
     * @param {number} version - The `version` parameter represents the version of
     * the user's credentials. It is used to check if the provided credentials are
     * still valid or if they have been updated since the last time they were
     * used.
     * @returns a Promise that resolves to a UserEntity object.
     */
    public async findOneByCredentials(
        id: number,
        version: number,
    ): Promise<UserEntity> {
        const user = await this.usersRepository.findOne({ id });
        this.throwUnauthorizedException(user);

        if (user.credentials.version !== version) {
            throw new UnauthorizedException("Invalid credentials");
        }

        return user;
    }

    /**
     * The `confirmEmail` function confirms the email of a user by updating their
     * `confirmed` status and saving the changes.
     * @param {number} userId - The `userId` parameter is the unique identifier of
     * the user whose email needs to be confirmed. It is of type `number`.
     * @param {number} version - The `version` parameter represents the version
     * number of the user's credentials. It is used to ensure that the user's
     * credentials are up to date and match the version stored in the database.
     * @returns a Promise that resolves to a UserEntity object.
     */
    public async confirmEmail(
        userId: number,
        version: number,
    ): Promise<UserEntity> {
        const user = await this.findOneByCredentials(userId, version);

        if (user.confirmed) {
            throw new BadRequestException("Email already confirmed");
        }

        user.confirmed = true;
        user.credentials.updateVersion();
        await this.commonService.saveEntity(this.usersRepository, user);
        return user;
    }

    /**
     * The `update` function updates a user's name and username, ensuring that the
     * new values are different from the current values and checking for
     * uniqueness of the username.
     * @param {number} userId - The `userId` parameter is the unique identifier of
     * the user that needs to be updated. It is of type `number`.
     * @param {UpdateUserDto} dto - The `dto` parameter is an object of type
     * `UpdateUserDto` which contains the updated information for the user. It may
     * have properties like `name` and `username` which represent the new name and
     * username for the user.
     * @returns a Promise that resolves to a UserEntity object.
     */
    public async update(
        userId: number,
        dto: UpdateUserDto,
    ): Promise<UserEntity> {
        const user = await this.findOneById(userId);
        const { name, username } = dto;

        if (!isUndefined(name) && !isNull(name)) {
            if (name === user.name) {
                throw new BadRequestException("Name must be different");
            }

            user.name = this.commonService.formatName(name);
        }
        if (!isUndefined(username) && !isNull(username)) {
            const formattedUsername = dto.username.toLowerCase();

            if (user.username === formattedUsername) {
                throw new BadRequestException("Username should be different");
            }

            await this.checkUsernameUniqueness(formattedUsername);
            user.username = formattedUsername;
        }

        await this.commonService.saveEntity(this.usersRepository, user);
        return user;
    }

    /**
     * The function updates a user's password, performing various checks and
     * validations before making the update.
     * @param {number} userId - The `userId` parameter is the unique identifier of
     * the user whose password needs to be updated.
     * @param {string} newPassword - The new password that the user wants to set.
     * @param {string} [password] - The current password of the user.
     * @returns a Promise that resolves to a UserEntity object.
     */
    public async updatePassword(
        userId: number,
        newPassword: string,
        password?: string,
    ): Promise<UserEntity> {
        const user = await this.findOneById(userId);

        if (user.password === "UNSET") {
            await this.createOAuthProvider(OAuthProvidersEnum.LOCAL, user.id);
        } else {
            if (isUndefined(password) || isNull(password)) {
                throw new BadRequestException("Password is required");
            }
            if (!(await compare(password, user.password))) {
                throw new BadRequestException("Wrong password");
            }
            if (await compare(newPassword, user.password)) {
                throw new BadRequestException("New password must be different");
            }
        }

        return await this.changePassword(user, newPassword);
    }

    /**
     * The `resetPassword` function takes in a user ID, version, and new password,
     * finds the user by their credentials, and changes their password.
     * @param {number} userId - The userId parameter is the unique identifier of
     * the user whose password needs to be reset.
     * @param {number} version - The "version" parameter is used to specify the
     * version of the user's credentials. It is likely used to ensure that the
     * user's credentials are up to date and match the specified version before
     * resetting the password.
     * @param {string} password - The "password" parameter is a string that
     * represents the new password that the user wants to set.
     * @returns a Promise that resolves to a UserEntity object.
     */
    public async resetPassword(
        userId: number,
        version: number,
        password: string,
    ): Promise<UserEntity> {
        const user = await this.findOneByCredentials(userId, version);
        return await this.changePassword(user, password);
    }

    /**
     * The function updates the email of a user if the provided password is
     * correct and the new email is different from the current one.
     * @param {number} userId - The `userId` parameter is the unique identifier of
     * the user whose email is being updated. It is of type `number`.
     * @param {ChangeEmailDto} dto - The `dto` parameter is an object of type
     * `ChangeEmailDto` which contains the following properties:
     * @returns a Promise that resolves to a UserEntity object.
     */
    public async updateEmail(
        userId: number,
        dto: ChangeEmailDto,
    ): Promise<UserEntity> {
        const user = await this.findOneById(userId);
        const { email, password } = dto;

        if (!(await compare(password, user.password))) {
            throw new BadRequestException("Wrong password");
        }

        const formattedEmail = email.toLowerCase();

        if (user.email === formattedEmail) {
            throw new BadRequestException("Email should be different");
        }

        await this.checkEmailUniqueness(formattedEmail);
        user.email = formattedEmail;
        await this.commonService.saveEntity(this.usersRepository, user);
        return user;
    }

    /**
     * The function deletes a user entity if the provided password matches the
     * user's password.
     * @param {number} userId - The `userId` parameter is the unique identifier of
     * the user that needs to be deleted. It is of type `number`.
     * @param {PasswordDto} dto - The `dto` parameter is an object of type
     * `PasswordDto`. It likely contains the password that the user wants to use
     * for authentication.
     * @returns a Promise that resolves to a UserEntity object.
     */
    public async delete(userId: number, dto: PasswordDto): Promise<UserEntity> {
        const user = await this.findOneById(userId);

        if (!(await compare(dto.password, user.password))) {
            throw new BadRequestException("Wrong password");
        }

        await this.commonService.removeEntity(this.usersRepository, user);
        return user;
    }

    /**
     * The function finds or creates a user based on their email and OAuth
     * provider, and returns the user entity.
     * @param {OAuthProvidersEnum} provider - The `provider` parameter is an enum
     * that represents the OAuth provider. It specifies the source of
     * authentication, such as Google, Facebook, or Twitter.
     * @param {string} email - The email parameter is a string that represents the
     * email address of the user.
     * @param {string} name - The `name` parameter is a string that represents the
     * name of the user.
     * @returns a Promise that resolves to a UserEntity object.
     */
    public async findOrCreate(
        provider: OAuthProvidersEnum,
        email: string,
        name: string,
    ): Promise<UserEntity> {
        const formattedEmail = email.toLowerCase();
        const user = await this.usersRepository.findOne(
            {
                email: formattedEmail,
            },
            {
                populate: ["oauthProviders"],
            },
        );

        if (isUndefined(user) || isNull(user)) {
            return this.create(provider, email, name);
        }
        if (
            isUndefined(
                user.oauthProviders
                    .getItems()
                    .find((p) => p.provider === provider),
            )
        ) {
            await this.createOAuthProvider(provider, user.id);
        }

        return user;
    }

    /**
     * The function `findOAuthProviders` retrieves a list of OAuth providers
     * associated with a specific user, ordered by provider name in ascending
     * order.
     * @param {number} userId - The `userId` parameter is the unique identifier of
     * the user for whom we want to find the OAuth providers.
     * @returns a Promise that resolves to an array of OAuthProviderEntity
     * objects.
     */
    public async findOAuthProviders(
        userId: number,
    ): Promise<OAuthProviderEntity[]> {
        return await this.oauthProvidersRepository.find(
            {
                user: userId,
            },
            { orderBy: { provider: QueryOrder.ASC } },
        );
    }

    /**
     * The function changes the password of a user entity and returns the updated
     * user entity.
     * @param {UserEntity} user - The "user" parameter is an instance of the
     * UserEntity class, which represents a user in the system. It contains
     * information about the user, such as their username, email, and password.
     * @param {string} password - The `password` parameter is the new password
     * that the user wants to change to.
     * @returns a Promise that resolves to a UserEntity object.
     */
    private async changePassword(
        user: UserEntity,
        password: string,
    ): Promise<UserEntity> {
        user.credentials.updatePassword(user.password);
        user.password = await hash(password, 10);
        await this.commonService.saveEntity(this.usersRepository, user);
        return user;
    }

    /**
     * The function checks if a given username is already in use and throws an
     * exception if it is.
     * @param {string} username - A string representing the username that needs to
     * be checked for uniqueness.
     */
    private async checkUsernameUniqueness(username: string): Promise<void> {
        const count = await this.usersRepository.count({ username });

        if (count > 0) {
            throw new ConflictException("Username already in use");
        }
    }

    /**
     * The function throws an UnauthorizedException if the user is undefined or
     * null.
     * @param {undefined | null | UserEntity} user - The user parameter is of type
     * undefined, null, or UserEntity.
     */
    private throwUnauthorizedException(
        user: undefined | null | UserEntity,
    ): void {
        if (isUndefined(user) || isNull(user)) {
            throw new UnauthorizedException("Invalid credentials");
        }
    }

    /**
     * The function checks if an email is already in use by querying the users
     * repository and throwing a ConflictException if the count is greater than 0.
     * @param {string} email - The email parameter is a string that represents the
     * email address to be checked for uniqueness.
     */
    private async checkEmailUniqueness(email: string): Promise<void> {
        const count = await this.usersRepository.count({ email });

        if (count > 0) {
            throw new ConflictException("Email already in use");
        }
    }

    /**
     * The function generates a unique username based on a given name by appending
     * a count if there are existing usernames with the same point slug.
     * @param {string} name - The `name` parameter is a string that represents the
     * user's name.
     * @returns The function `generateUsername` returns a Promise that resolves to
     * a string.
     */
    private async generateUsername(name: string): Promise<string> {
        const pointSlug = this.commonService.generatePointSlug(name);
        const count = await this.usersRepository.count({
            username: {
                $like: `${pointSlug}%`,
            },
        });

        if (count > 0) {
            return `${pointSlug}${count}`;
        }

        return pointSlug;
    }

    /**
     * The function creates an OAuth provider entity and saves it to the
     * repository.
     * @param {OAuthProvidersEnum} provider - The `provider` parameter is an enum
     * value that represents the OAuth provider. It could be one of the following
     * values: `Google`, `Facebook`, `Twitter`, etc.
     * @param {number} userId - The `userId` parameter is the ID of the user for
     * whom the OAuth provider is being created.
     * @returns a Promise that resolves to an instance of the
     * `OAuthProviderEntity` class.
     */
    private async createOAuthProvider(
        provider: OAuthProvidersEnum,
        userId: number,
    ): Promise<OAuthProviderEntity> {
        const oauthProvider = this.oauthProvidersRepository.create({
            provider,
            user: userId,
        });
        await this.commonService.saveEntity(
            this.oauthProvidersRepository,
            oauthProvider,
            true,
        );
        return oauthProvider;
    }
}
