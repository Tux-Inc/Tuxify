import { Inject, Injectable, Logger } from "@nestjs/common";
import { Flow } from "./schemas/flow.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { FlowActionData } from "./events/FlowActionData.event";
import { GetFlow } from "./events/GetFlow.event";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";

@Injectable()
export class FlowsService {
    private readonly logger = new Logger(FlowsService.name);
    constructor(
        @InjectModel(Flow.name) private readonly flowModel: Model<Flow>,
        @Inject('NATS_CLIENT') private readonly natsClient: ClientProxy,
    ) {}

    async getFlows(userId: number): Promise<Flow[]> {
        this.logger.log(`Getting flows for user ${userId}`);
        return this.flowModel.find({
            userId,
        });
    }

    async createFlow(flow: Flow): Promise<Flow> {
        this.logger.log(`Creating flow ${flow.name} for user ${flow.userId}`);
        const createdFlow = new this.flowModel(flow);
        return await createdFlow.save();
    }

    async getFlow(getFlow: GetFlow): Promise<Flow> {
        this.logger.log(`Getting flow ${getFlow.id} for user ${getFlow.userId}`);
        return this.flowModel.findOne({
            _id: getFlow.id,
            userId: getFlow.userId,
        });
    }

    async updateFlow(flow: Flow): Promise<Flow> {
        this.logger.log(`Updating flow ${flow._id} for user ${flow.userId}`);
        return this.flowModel.findOneAndUpdate({
            _id: flow._id,
            userId: flow.userId,
        }, flow);
    }

    async deleteFlow(getFlow: GetFlow): Promise<Flow> {
        this.logger.log(`Deleting flow ${getFlow.id} for user ${getFlow.userId}`);
        return this.flowModel.findOneAndDelete({
            _id: getFlow.id,
            userId: getFlow.userId,
        });
    }

    async handleActions(flowActionData: FlowActionData): Promise<string> {
        this.logger.log(`Received flow trigger ${flowActionData.actionName} for user ${flowActionData.userId}`);
        const flows: Flow[] = await this.findFlowsForUserAction(flowActionData.userId, flowActionData.actionName);
        this.logger.log(`Found ${flows.length} flows`);
        for (const flow of flows)
            await this.executeFlow(flow, flowActionData);
        return "👍";
    }

    async executeFlow(flow: Flow, flowActionData: FlowActionData): Promise<void> {
        this.logger.log(`Executing flow ${flow._id} for user ${flow.userId}`);

        const stepResults = {};
        for (const step of flow.data) {
            this.logger.log(`Executing step ${step.uuid}`);
            if (step.type === 'action') {
                if (step.name !== flowActionData.actionName) {
                    this.logger.log(`Skipping step ${step.uuid} because it is not the action that triggered this flow`);
                    continue;
                } else {
                    this.logger.log(`Step ${step.uuid} is the action that triggered this flow`);
                    stepResults[step.uuid] = flowActionData.data;
                    continue;
                }
            }
            try {
                const resolvedInputs = this.resolveStepInputs(stepResults, step.inputs);
                stepResults[step.uuid] = await this.executeStep(step, resolvedInputs, flow.userId);
            } catch (error) {
                this.logger.error(`Error executing step ${step.uuid}: ${error.message}`);
                return;
            }
        }

        await this.updateFlow({...flow, lastRun: new Date()});
        this.logger.log(`Flow ${flow._id} executed successfully.`);
    }

    private resolveStepInputs(stepResults: any, inputs: any): any {
        const resolvedInputs = {};
        for (const input of inputs) {
            if (input.value && typeof input.value === 'string' && input.value.startsWith('{{') && input.value.endsWith('}}')) {
                const [stepUuid, outputName] = input.value.slice(2, -3).split('.').slice(-2);
                if (stepResults[stepUuid] && stepResults[stepUuid][outputName] !== undefined) {
                    resolvedInputs[input.name] = stepResults[stepUuid][outputName];
                } else {
                    throw new Error(`Missing required input ${input.name} for step ${stepUuid}`);
                }
            } else {
                resolvedInputs[input.name] = input.value;
            }
        }
        return resolvedInputs;
    }

    private async executeStep(step: any, inputs: any, userId: number): Promise<unknown> {
        this.logger.log(`Executing step ${step.uuid}`);
        return lastValueFrom(this.natsClient.send<any, any>(step.name, {userId, input: inputs}));
    }

    private async findFlowsForUserAction(userId: number, actionName: string): Promise<Flow[]> {
        this.logger.log(`Finding flows for user ${userId} and action ${actionName}`);
        return this.flowModel.find({
            userId,
            enabled: true,
            'data': {
                $elemMatch: {
                    name: actionName,
                }
            }
        });
    }
}
