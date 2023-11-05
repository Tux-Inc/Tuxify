/*
 * File Name: microsoft.module.ts
 * Author: neptos
 * Creation Date: 2023
 *
 * Copyright (c) 2023 Tux Inc. (backend)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { TokensModule } from "./tokens/tokens.module";
import { MicrosoftService } from "./microsoft.service";
import { ActionsModule } from "./actions/actions.module";
import { MicrosoftController } from "./microsoft.controller";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ReactionsModule } from "./reactions/reactions.module";

@Module({
    imports: [
        ClientsModule.register([
            {
                name: "NATS_CLIENT",
                transport: Transport.NATS,
                options: {
                    servers: [
                        process.env.NATS_SERVER_URL || "nats://localhost:4222",
                    ],
                },
            },
        ]),
        AuthModule,
        ReactionsModule,
        ActionsModule,
        TokensModule,
    ],
    controllers: [MicrosoftController],
    providers: [MicrosoftService],
})

/* The MicrosoftModule class is exported for use in TypeScript. */
export class MicrosoftModule {}
