/*
File Name: reactions.module.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: ReactionsModule for ReactionsModule logic and routes definition
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

import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { GmailService } from "../gmail/gmail.service";
import { ReactionsService } from "./reactions.service";
import { TokensService } from "../tokens/tokens.service";
import { ReactionsController } from "./reactions.controller";
import { CalendarService } from "../calendar/calendar.service";
import { ClientsModule, Transport } from "@nestjs/microservices";

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
        HttpModule,
    ],
    controllers: [ReactionsController],
    providers: [ReactionsService, GmailService, CalendarService, TokensService],
})
/* The ReactionsModule class is exported. */
export class ReactionsModule {}
