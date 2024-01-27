/*
File Name: flows.service.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Service for flows module
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

import { Model } from "mongoose";
import { lastValueFrom } from "rxjs";
import { Flow } from "./schemas/flow.schema";
import { InjectModel } from "@nestjs/mongoose";
import { GetFlow } from "./events/GetFlow.event";
import { ClientProxy } from "@nestjs/microservices";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { FlowActionData } from "./events/FlowActionData.event";

/* The `FlowsService` class is responsible for managing flows, including creating,
updating, deleting, and executing flows based on user actions. */
@Injectable()
export class FlowsService {
    private readonly logger = new Logger(FlowsService.name);

    /**
     * The constructor function initializes the flowModel and natsClient
     * variables.
     * @param flowModel - The `flowModel` parameter is an instance of the
     * `Model<Flow>` class. It is used to interact with the database and perform
     * CRUD operations on the `Flow` model. It is injected using the
     * `@InjectModel(Flow.name)` decorator, which is provided by the NestJS
     * framework
     * @param {ClientProxy} natsClient - The `natsClient` parameter is an instance
     * of the NATS client, which is used for communication with the NATS messaging
     * system. It is injected using the `@Inject` decorator with the token
     * `"NATS_CLIENT"`.
     */
    constructor(
        @InjectModel(Flow.name) private readonly flowModel: Model<Flow>,
        @Inject("NATS_CLIENT") private readonly natsClient: ClientProxy,
    ) {}

    /**
     * The function `getFlows` retrieves flows for a specific user.
     * @param {number} userId - The `userId` parameter is a number that represents
     * the unique identifier of a user.
     * @returns The function `getFlows` is returning a promise that resolves to an
     * array of `Flow` objects.
     */
    async getFlows(userId: number): Promise<Flow[]> {
        this.logger.log(`Getting flows for user ${userId}`);
        return this.flowModel.find({
            userId,
        });
    }

    /**
     * The function creates a flow, logs the creation, subscribes to it if needed,
     * and saves it.
     * @param {Flow} flow - The `flow` parameter is an object that represents the
     * flow to be created. It contains properties such as `name` (the name of the
     * flow) and `userId` (the ID of the user associated with the flow).
     * @returns a Promise that resolves to a Flow object.
     */
    async createFlow(flow: Flow): Promise<Flow> {
        this.logger.log(`Creating flow ${flow.name} for user ${flow.userId}`);
        const createdFlow = new this.flowModel(flow);
        this.subscribeIfNeeded(createdFlow);
        return await createdFlow.save();
    }

    /**
     * The function `getFlow` retrieves a flow document from the flowModel
     * collection based on the provided flow ID and user ID.
     * @param {GetFlow} getFlow - The parameter `getFlow` is of type `GetFlow`,
     * which is an object containing the following properties:
     * @returns a Promise that resolves to a Flow object.
     */
    async getFlow(getFlow: GetFlow): Promise<Flow> {
        this.logger.log(
            `Getting flow ${getFlow.id} for user ${getFlow.userId}`,
        );
        return this.flowModel.findOne({
            _id: getFlow.id,
            userId: getFlow.userId,
        });
    }

    /**
     * The function updates a flow in the database and returns the updated flow.
     * @param {Flow} flow - The `flow` parameter is an object that represents a
     * flow. It contains properties such as `_id` (the unique identifier of the
     * flow) and `userId` (the user ID associated with the flow).
     * @returns a Promise that resolves to a Flow object.
     */
    async updateFlow(flow: Flow): Promise<Flow> {
        this.logger.log(`Updating flow ${flow._id} for user ${flow.userId}`);
        this.subscribeIfNeeded(flow);
        return this.flowModel.findOneAndUpdate(
            {
                _id: flow._id,
                userId: flow.userId,
            },
            flow,
        );
    }

    /**
     * The function deletes a flow from the flow model based on the provided flow
     * ID and user ID.
     * @param {GetFlow} getFlow - The `getFlow` parameter is an object that
     * contains the following properties:
     * @returns The `deleteFlow` function is returning a Promise that resolves to
     * a `Flow` object.
     */
    async deleteFlow(getFlow: GetFlow): Promise<Flow> | null {
        this.logger.log(
            `Deleting flow ${getFlow.id} for user ${getFlow.userId}`,
        );
        return this.flowModel.findOneAndDelete({
            _id: getFlow.id,
            userId: getFlow.userId,
        });
    }

    /**
     * The function `subscribeIfNeeded` checks if a flow has any actions, and if
     * so, subscribes to each action by emitting an event with the action name and
     * input values.
     * @param {Flow} flow - The `flow` parameter is an object that represents a
     * flow. It contains various properties such as `data`, `userId`, and `_id`.
     * The `data` property is an array of steps in the flow, where each step has
     * properties like `type`, `name`, and `inputs`. The
     * @returns a Promise that resolves to void (i.e., no value).
     */
    private async subscribeIfNeeded(flow: Flow): Promise<void> {
        try {
            if (!flow.data) return;
            const actions = flow.data.filter((step) => step.type === "action");
            if (actions.length === 0) return;
            for (const action of actions) {
                try {
                    this.logger.log(`Subscribing to action ${action.name}`);
                    const subscribeActionName = action.name.replace(
                        "action",
                        "subscribe",
                    );
                    const subscribeActionInput = {};
                    for (const input of action.inputs) {
                        subscribeActionInput[input.name] = input.value;
                    }
                    this.natsClient.emit(subscribeActionName, {
                        userId: flow.userId,
                        input: subscribeActionInput,
                    });
                } catch (error) {
                    this.logger.error(
                        `Error subscribing to action ${action.name}: ${error.message}`,
                    );
                }
            }
        } catch (error) {
            this.logger.error(
                `Error subscribing to flow ${flow._id}: ${error.message}`,
            );
        }
    }

    /**
     * The function handles flow actions by logging the trigger, finding relevant
     * flows for the user and action, executing each flow, and returning a success
     * message.
     * @param {FlowActionData} flowActionData - The `flowActionData` parameter is
     * an object that contains information about the flow trigger. It has the
     * following properties:
     * @returns a string "👍".
     */
    async handleActions(flowActionData: FlowActionData): Promise<string> {
        this.logger.log(
            `Received flow trigger ${flowActionData.actionName} for user ${flowActionData.userId}`,
        );
        const flows: Flow[] = await this.findFlowsForUserAction(
            flowActionData.userId,
            flowActionData.actionName,
        );
        this.logger.log(`Found ${flows.length} flows`);
        for (const flow of flows) await this.executeFlow(flow, flowActionData);
        return "👍";
    }

    /**
     * The function `executeFlow` executes a flow by iterating through its steps,
     * resolving inputs, and executing each step, logging any errors encountered.
     * @param {Flow} flow - The `flow` parameter is an object that represents a
     * flow. It contains information about the flow, such as its ID, user ID, and
     * data (which is an array of steps).
     * @param {FlowActionData} flowActionData - The `flowActionData` parameter is
     * an object that contains the data related to the action that triggered the
     * flow. It includes the `actionName` property, which represents the name of
     * the action, and the `data` property, which contains any additional data
     * associated with the action.
     * @returns a Promise that resolves to void (i.e., no value).
     */
    async executeFlow(
        flow: Flow,
        flowActionData: FlowActionData,
    ): Promise<void> {
        this.logger.log(`Executing flow ${flow._id} for user ${flow.userId}`);

        const stepResults = {};
        for (const step of flow.data) {
            if (step.type === "action") {
                if (step.name !== flowActionData.actionName) {
                    this.logger.log(
                        `Skipping step ${step.uuid} because it is not the action that triggered this flow`,
                    );
                    continue;
                } else {
                    this.logger.log(
                        `Step ${step.uuid} is the action that triggered this flow`,
                    );
                    stepResults[step.uuid] = flowActionData.data;
                    continue;
                }
            }
            try {
                this.logger.log(`Executing step ${step.uuid}`);
                const resolvedInputs = this.resolveStepInputs(
                    stepResults,
                    step.inputs,
                );
                stepResults[step.uuid] = await this.executeStep(
                    step,
                    resolvedInputs,
                    flow.userId,
                );
            } catch (error) {
                this.logger.error(
                    `Error executing step ${step.uuid}: ${error.message}`,
                );
                return;
            }
        }

        await this.updateFlow({ ...flow, lastRun: new Date() });
        this.logger.log(`Flow ${flow._id} executed successfully.`);
    }

    /**
     * The function `resolveStepInputs` resolves the inputs for a step by
     * replacing any input values that are in the format `{{stepUuid.outputName}}`
     * with the corresponding output value from a previous step.
     * @param {any} stepResults - An object containing the results of each step.
     * The keys are step UUIDs and the values are objects containing the outputs
     * of each step.
     * @param {any} inputs - The `inputs` parameter is an array of objects. Each
     * object represents an input and has two properties: `name` and `value`. The
     * `name` property is a string that represents the name of the input, and the
     * `value` property can be of any type and represents the value of
     * @returns The function `resolveStepInputs` returns an object
     * `resolvedInputs` which contains the resolved values for each input.
     */
    private resolveStepInputs(stepResults: any, inputs: any): any {
        const resolvedInputs = {};
        for (const input of inputs) {
            if (
                input.value &&
                typeof input.value === "string" &&
                input.value.startsWith("{{") &&
                input.value.endsWith("}}")
            ) {
                const [stepUuid, outputName] = input.value
                    .slice(2, -3)
                    .split(".")
                    .slice(-2);
                if (
                    stepResults[stepUuid] &&
                    stepResults[stepUuid][outputName] !== undefined
                ) {
                    resolvedInputs[input.name] =
                        stepResults[stepUuid][outputName];
                } else {
                    throw new Error(
                        `Missing required input ${input.name} for step ${stepUuid}`,
                    );
                }
            } else {
                resolvedInputs[input.name] = input.value;
            }
        }
        return resolvedInputs;
    }

    /**
     * The `executeStep` function is a private asynchronous function that logs the
     * execution of a step and sends a message to a NATS client with the step
     * name, user ID, and input data.
     * @param {any} step - The `step` parameter is an object that represents a
     * specific step in a process or workflow. It likely contains properties such
     * as `uuid` (a unique identifier for the step) and `name` (the name of the
     * step).
     * @param {any} inputs - The `inputs` parameter is an object that contains the
     * input data for the step. It can be any type of data that is required by the
     * step to perform its task.
     * @param {number} userId - The `userId` parameter is a number that represents
     * the user ID. It is used as a parameter when sending a message to the
     * `natsClient` using the `send` method.
     * @returns The function `executeStep` is returning a `Promise` that resolves
     * to an unknown value.
     */
    private async executeStep(
        step: any,
        inputs: any,
        userId: number,
    ): Promise<unknown> {
        this.logger.log(`Executing step ${step.uuid}`);
        return lastValueFrom(
            this.natsClient.send<any, any>(step.name, {
                userId,
                input: inputs,
            }),
        );
    }

    /**
     * The function `findFlowsForUserAction` finds flows for a given user and
     * action name.
     * @param {number} userId - The userId parameter is a number that represents
     * the unique identifier of a user.
     * @param {string} actionName - The `actionName` parameter is a string that
     * represents the name of the action for which you want to find flows.
     * @returns a Promise that resolves to an array of Flow objects.
     */
    private async findFlowsForUserAction(
        userId: number,
        actionName: string,
    ): Promise<Flow[]> {
        this.logger.log(
            `Finding flows for user ${userId} and action ${actionName}`,
        );
        return this.flowModel.find({
            userId,
            enabled: true,
            data: {
                $elemMatch: {
                    name: actionName,
                },
            },
        });
    }
}
