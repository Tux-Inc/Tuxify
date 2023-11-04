/*
File Name: users.controller.spec.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Tests for users controller

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

import { config } from "../../config";
import { faker } from "@faker-js/faker";
import { MikroORM } from "@mikro-orm/core";
import { ConfigModule } from "@nestjs/config";
import { UsersService } from "../users.service";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { CacheModule } from "@nestjs/cache-manager";
import { UserEntity } from "../entities/user.entity";
import { UsersController } from "../users.controller";
import { Test, TestingModule } from "@nestjs/testing";
import { CommonModule } from "../../common/common.module";
import { validationSchema } from "../../config/config.schema";
import { MikroOrmConfig } from "../../config/mikroorm.config";
import { OAuthProvidersEnum } from "../enums/oauth-providers.enum";
import { ResponseUserMapper } from "../mappers/response-user.mapper";
import { OAuthProviderEntity } from "../entities/oauth-provider.entity";
import { createResponseMock } from "../../common/tests/mocks/response.mock";
import { AuthResponseUserMapper } from "../../auth/mappers/auth-response-user.mapper";

describe("UsersController", () => {
    let module: TestingModule,
        service: UsersService,
        controller: UsersController,
        orm: MikroORM,
        user: UserEntity;

    const name = faker.name.firstName();
    const email = faker.internet.email().toLowerCase();
    const password = faker.internet.password(10);

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    isGlobal: true,
                    validationSchema,
                    load: [config],
                }),
                CacheModule.register({
                    isGlobal: true,
                    ttl: parseInt(process.env.JWT_REFRESH_TIME, 10),
                }),
                MikroOrmModule.forRootAsync({
                    imports: [ConfigModule],
                    useClass: MikroOrmConfig,
                }),
                MikroOrmModule.forFeature([UserEntity, OAuthProviderEntity]),
                CommonModule,
            ],
            providers: [UsersService, CommonModule],
            controllers: [UsersController],
        }).compile();

        service = module.get<UsersService>(UsersService);
        controller = module.get<UsersController>(UsersController);
        orm = module.get<MikroORM>(MikroORM);
        await orm.getSchemaGenerator().createSchema();

        user = await service.create(
            OAuthProvidersEnum.LOCAL,
            email,
            name,
            password,
        );
    });

    it("should be defined", () => {
        expect(module).toBeDefined();
        expect(service).toBeDefined();
        expect(controller).toBeDefined();
        expect(orm).toBeDefined();
        expect(user).toBeDefined();
    });

    describe("get user", () => {
        it("throw a not found error if id does not exist", async () => {
            await expect(
                controller.getUser({ idOrUsername: (user.id + 1).toString() }),
            ).rejects.toThrow("User not found");
        });

        it("throw a not found error if username does not exist", async () => {
            await expect(
                controller.getUser({ idOrUsername: `${user.username}-no` }),
            ).rejects.toThrow("User not found");
        });

        it("should return the user by id", async () => {
            await expect(
                controller.getUser({
                    idOrUsername: user.id.toString(),
                }),
            ).resolves.toBeInstanceOf(ResponseUserMapper);
        });
    });

    describe("updates", () => {
        const name2 = faker.name.firstName();
        const email2 = faker.internet.email().toLowerCase();
        const password2 = faker.internet.password(10);
        let username: string;

        beforeAll(async () => {
            const user2 = await service.create(
                OAuthProvidersEnum.LOCAL,
                email2,
                name2,
                password2,
            );
            username = user2.username;
        });

        describe("update email", () => {
            it("throw an error if password is wrong", async () => {
                await expect(
                    controller.updateEmail(user.id, {
                        email: faker.internet.email(),
                        password: "wrong",
                    }),
                ).rejects.toThrow("Wrong password");
            });

            it("throw an error if email is the same", async () => {
                await expect(
                    controller.updateEmail(user.id, {
                        email,
                        password,
                    }),
                ).rejects.toThrow("Email should be different");
            });

            it("should throw an error if email already in use", async () => {
                await expect(
                    controller.updateEmail(user.id, {
                        email: email2,
                        password,
                    }),
                ).rejects.toThrow("Email already in use");
            });

            it("should update email", async () => {
                await expect(
                    controller.updateEmail(user.id, {
                        email: faker.internet.email(),
                        password,
                    }),
                ).resolves.toBeInstanceOf(AuthResponseUserMapper);
            });
        });

        describe("update", () => {
            it("should throw an error if username is already taken", async () => {
                await expect(
                    controller.updateUser(user.id, {
                        username,
                    }),
                ).rejects.toThrow("Username already in use");
            });

            it("should throw an error if username is the same", async () => {
                await expect(
                    controller.updateUser(user.id, {
                        username: user.username,
                    }),
                ).rejects.toThrow("Username should be different");
            });

            it("should update username", async () => {
                await expect(
                    controller.updateUser(user.id, {
                        username: "new_username",
                    }),
                ).resolves.toBeInstanceOf(ResponseUserMapper);
            });

            it("should update name", async () => {
                await expect(
                    controller.updateUser(user.id, {
                        name: faker.name.firstName(),
                    }),
                ).resolves.toBeInstanceOf(ResponseUserMapper);
            });
        });
    });

    describe("delete", () => {
        const res = createResponseMock();

        it("should throw an error if password is wrong", async () => {
            await expect(
                controller.deleteUser(
                    user.id,
                    {
                        password: "wrong",
                    },
                    res,
                ),
            ).rejects.toThrow("Wrong password");
        });

        it("should delete user", async () => {
            await controller.deleteUser(
                user.id,
                {
                    password,
                },
                res,
            );

            await expect(service.findOneById(user.id)).rejects.toThrow(
                "User not found",
            );
        });
    });

    afterAll(async () => {
        await orm.getSchemaGenerator().dropSchema();
        await orm.close(true);
        await module.close();
    });
});
