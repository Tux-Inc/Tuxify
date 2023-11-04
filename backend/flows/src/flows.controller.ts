/*
File Name: flows.controller.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Controller for flows module
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
    Ctx,
    EventPattern,
    MessagePattern,
    Payload,
} from "@nestjs/microservices";
import { Flow } from "./schemas/flow.schema";
import { FlowsService } from "./flows.service";
import { GetFlow } from "./events/GetFlow.event";
import { Controller, Logger } from "@nestjs/common";
import { FlowActionData } from "./events/FlowActionData.event";

/* The FlowsController class is a TypeScript controller that handles various
message and event patterns related to flows. */
@Controller()
export class FlowsController {
    /**
     * The constructor function takes a FlowsService parameter and assigns it to
     * the flowsService property.
     * @param {FlowsService} flowsService - The `flowsService` parameter is of
     * type `FlowsService` and is marked as `private` and `readonly`. This means
     * that it can only be accessed within the class and its value cannot be
     * changed once it is assigned in the constructor.
     */
    constructor(private readonly flowsService: FlowsService) {}

    @MessagePattern("flows.get")
    /**
     * The function `getFlows` is an asynchronous function that takes a `userId`
     * as a parameter and returns a promise that resolves to an array of `Flow`
     * objects.
     * @param {number} userId - The `userId` parameter is of type `number` and
     * represents the unique identifier of a user.
     * @returns The `getFlows` function is returning a Promise that resolves to an
     * array of `Flow` objects.
     */
    async getFlows(@Payload() userId: number): Promise<Flow[]> {
        return this.flowsService.getFlows(userId);
    }

    @MessagePattern("flow.create")
    /**
     * The function creates a flow by calling the createFlow method of the
     * flowsService.
     * @param {Flow} flow - The `flow` parameter is of type `Flow` and is
     * decorated with `@Payload()`. It represents the data that will be used to
     * create a new flow.
     * @returns The createFlow function is returning a Promise that resolves to a
     * Flow object.
     */
    async createFlow(@Payload() flow: Flow): Promise<Flow> {
        return this.flowsService.createFlow(flow);
    }

    @MessagePattern("flow.get")
    /**
     * The function `getFlow` is an asynchronous function that takes a `getFlow`
     * payload and returns a `Flow` promise.
     * @param {GetFlow} getFlow - The `getFlow` parameter is of type `GetFlow` and
     * is decorated with `@Payload()`. It is used to pass the necessary data for
     * retrieving a flow.
     * @returns a Promise that resolves to a Flow object.
     */
    async getFlow(@Payload() getFlow: GetFlow): Promise<Flow> {
        return this.flowsService.getFlow(getFlow);
    }

    @MessagePattern("flow.update")
    /**
     * The function `updateFlow` is an asynchronous function that takes a `Flow`
     * object as a parameter and returns a promise that resolves to a `Flow`
     * object.
     * @param {Flow} flow - The `flow` parameter is of type `Flow` and represents
     * the flow object that needs to be updated.
     * @returns The `updateFlow` function is returning a Promise that resolves to
     * a Flow object.
     */
    async updateFlow(@Payload() flow: Flow): Promise<Flow> {
        return this.flowsService.updateFlow(flow);
    }

    @MessagePattern("flow.delete")
    /**
     * The function `deleteFlow` is an asynchronous function that takes a
     * `GetFlow` payload and returns a `Flow` promise. It calls the `deleteFlow`
     * method of the `flowsService` object.
     * @param {GetFlow} getFlow - The `getFlow` parameter is of type `GetFlow` and
     * is decorated with `@Payload()`. It is used to pass the necessary
     * information to identify the flow that needs to be deleted.
     * @returns The deleteFlow function is returning a Promise that resolves to a
     * Flow object.
     */
    async deleteFlow(@Payload() getFlow: GetFlow): Promise<Flow> {
        return this.flowsService.deleteFlow(getFlow);
    }

    @EventPattern("flows.actions")
    /**
     * The function "handleActions" takes in a payload of flow action data and
     * returns a promise that resolves to a string.
     * @param {FlowActionData} flowActionData - The `flowActionData` parameter is
     * of type `FlowActionData`. It is a payload that contains data related to the
     * flow actions being handled.
     * @returns The handleActions method is returning a Promise that resolves to a
     * string.
     */
    async handleActions(
        @Payload() flowActionData: FlowActionData,
    ): Promise<string> {
        return this.flowsService.handleActions(flowActionData);
    }
}
