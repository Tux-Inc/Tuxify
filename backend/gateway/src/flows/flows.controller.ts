/*
File Name: flows.controller.spec.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Test for flows controller file
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
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    Param,
    ParseUUIDPipe,
    Post,
    Put,
    Req,
    UseGuards,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { isProviderStepName } from "@tuxify/common";
import { AuthGuard } from "../guards/auth.guard";
import { FlowDto } from "./dto/flow.dto";

/** Flow ids are UUIDs (see the flows service schema). */
const FlowId = () => Param("id", new ParseUUIDPipe());

@Controller("flows")
@UseGuards(AuthGuard)
export class FlowsController {
    constructor(
        @Inject("NATS_CLIENT") private readonly natsClient: ClientProxy,
    ) {}

    @Get()
    async getFlows(@Req() req: any): Promise<any> {
        return this.natsClient.send("flows.get", req.user);
    }

    @Post()
    async createFlow(@Req() req: any, @Body() flow: FlowDto): Promise<any> {
        return this.natsClient.send("flow.create", {
            ...flow,
            userId: req.user,
        });
    }

    @Get(":id")
    async getFlow(@FlowId() id: string, @Req() req: any): Promise<any> {
        return this.natsClient.send("flow.get", { id, userId: req.user });
    }

    @Put(":id")
    async updateFlow(
        @FlowId() id: string,
        @Req() req: any,
        @Body() flow: FlowDto,
    ): Promise<any> {
        return this.natsClient.send("flow.update", {
            ...flow,
            _id: id,
            userId: req.user,
        });
    }

    @Delete(":id")
    async deleteFlow(@FlowId() id: string, @Req() req: any): Promise<any> {
        return this.natsClient.send("flow.delete", { id, userId: req.user });
    }

    /** Manually triggers the flows of the current user that start with this action. */
    @Post("actions/:actionName")
    async triggerAction(
        @Param("actionName") actionName: string,
        @Req() req: any,
        @Body() data: Record<string, unknown>,
    ): Promise<any> {
        if (!isProviderStepName(actionName, "action")) {
            throw new BadRequestException("Unknown action");
        }
        return this.natsClient.send("flows.actions", {
            userId: req.user,
            actionName,
            data,
        });
    }
}
