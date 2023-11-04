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
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    Param,
    Post,
    Put,
    Req,
    UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "../guards/auth.guard";
import { ClientProxy } from "@nestjs/microservices";

/* The FlowsController class is a TypeScript controller that handles HTTP requests
related to flows, such as getting, creating, updating, and deleting flows, as
well as triggering actions. */
@Controller("flows")
export class FlowsController {
    /**
     * The constructor function takes in a client proxy object and injects it as a
     * dependency using the "NATS_CLIENT" token.
     * @param {ClientProxy} natsClient - The `natsClient` parameter is of type
     * `ClientProxy` and is being injected using the `@Inject` decorator. It is
     * likely being used to establish a connection to a NATS server for messaging
     * purposes.
     */
    constructor(
        @Inject("NATS_CLIENT") private readonly natsClient: ClientProxy,
    ) {}

    @UseGuards(AuthGuard)
    @Get()
    /**
     * The function `getFlows` is an asynchronous function that sends a request to
     * the `natsClient` to get flows using the user information from the request.
     * @param {any} req - The `req` parameter is an object that represents the
     * HTTP request being made to the server. It contains information such as the
     * request headers, query parameters, request body, and user information.
     * @returns a Promise that resolves to any data.
     */
    async getFlows(@Req() req: any): Promise<any> {
        return this.natsClient.send("flows.get", req.user);
    }

    @UseGuards(AuthGuard)
    @Post()
    /**
     * The function creates a flow by adding the user ID to the flow object and
     * sending it to a NATS client.
     * @param {any} req - The `req` parameter is an object that represents the
     * HTTP request. It contains information about the incoming request, such as
     * headers, query parameters, and the request body.
     * @param {any} flow - The `flow` parameter is an object that represents the
     * flow data that is being passed to the `createFlow` function. It is being
     * received from the request body.
     * @returns the result of the `this.natsClient.send("flow.create", flow)`
     * method call.
     */
    async createFlow(@Req() req: any, @Body() flow: any): Promise<any> {
        flow.userId = req.user;
        return this.natsClient.send("flow.create", flow);
    }

    @UseGuards(AuthGuard)
    @Get(":id")
    /**
     * The function `getFlow` is an asynchronous function that takes in an `id`
     * parameter and a `req` parameter, and it returns a promise that sends a
     * message to the `flow.get` topic with the `id` and `userId` as payload.
     * @param {string} id - The `id` parameter is a string that represents the
     * identifier of the flow that we want to retrieve. It is used to specify
     * which flow we want to get.
     * @param {any} req - The `req` parameter is an object that represents the
     * HTTP request being made to the server. It contains information such as the
     * request headers, query parameters, and the user making the request. In this
     * case, it is being used to access the `req.user` property, which presumably
     * contains the ID
     * @returns a Promise that resolves to an object. The object being returned is
     * the result of sending a message to the "flow.get" topic using the
     * natsClient. The message payload includes the "id" and "userId" properties,
     * where "id" is the value of the "id" parameter passed to the function, and
     * "userId" is the value of the "user"
     */
    async getFlow(@Param("id") id: string, @Req() req: any): Promise<any> {
        return this.natsClient.send("flow.get", { id, userId: req.user });
    }

    @UseGuards(AuthGuard)
    @Put(":id")
    /**
     * The function updates a flow by setting the user ID and flow ID, and then
     * sends the updated flow to a NATS client.
     * @param {string} id - The `id` parameter is a string that represents the
     * identifier of the flow that needs to be updated.
     * @param {any} req - The `req` parameter is an object that represents the
     * HTTP request being made to the server. It contains information such as the
     * request headers, query parameters, and request body. In this code snippet,
     * it is being used to access the `user` property, which is expected to
     * contain the user ID
     * @param {any} flow - The `flow` parameter is an object that represents the
     * updated flow data. It can contain any properties and values that are
     * relevant to the flow being updated.
     * @returns a Promise that resolves to any data.
     */
    async updateFlow(
        @Param("id") id: string,
        @Req() req: any,
        @Body() flow: any,
    ): Promise<any> {
        flow.userId = req.user;
        flow._id = id;
        return this.natsClient.send("flow.update", flow);
    }

    @UseGuards(AuthGuard)
    @Delete(":id")
    /**
     * The deleteFlow function is an asynchronous function that sends a message to
     * the "flow.delete" topic with the provided id and userId.
     * @param {string} id - The `id` parameter is a string that represents the
     * identifier of the flow that needs to be deleted. It is used to specify
     * which flow should be deleted.
     * @param {any} req - The `req` parameter is an object that represents the
     * HTTP request being made to the server. It contains information about the
     * request, such as the headers, body, and user information. In this case, it
     * is being used to access the `user` property, which represents the user
     * making the request
     * @returns a Promise that resolves to any data.
     */
    async deleteFlow(@Param("id") id: string, @Req() req: any): Promise<any> {
        return this.natsClient.send("flow.delete", { id, userId: req.user });
    }

    @UseGuards(AuthGuard)
    @Post("actions/:actionName")
    /**
     * The function `triggerAction` sends a message to a NATS client with the user
     * ID, action name, and data.
     * @param {string} actionName - The actionName parameter is a string that
     * represents the name of the action to be triggered.
     * @param {any} req - The `req` parameter is the request object that contains
     * information about the incoming HTTP request. It includes details such as
     * the request headers, query parameters, and body.
     * @param {any} data - The `data` parameter is an object that contains any
     * additional data that needs to be passed along with the action. It can be
     * used to provide any necessary information or context for the action to be
     * performed.
     * @returns a Promise that resolves to any data.
     */
    async triggerAction(
        @Param("actionName") actionName: string,
        @Req() req: any,
        @Body() data: any,
    ): Promise<any> {
        return this.natsClient.send(`flows.actions`, {
            userId: req.user,
            actionName,
            data,
        });
    }
}
