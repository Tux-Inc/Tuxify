import {Injectable, Logger} from '@nestjs/common';
import {Flow} from "./schemas/flow.schema";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import { FlowActionData } from "./events/FlowActionData.event";

@Injectable()
export class FlowsService {
    private readonly logger = new Logger(FlowsService.name);
    constructor(
        @InjectModel(Flow.name) private readonly flowModel: Model<Flow>,
    ) {}

    async createFlow(flow: Flow): Promise<Flow> {
        this.logger.log('Creating flow');
        const createdFlow = new this.flowModel(flow);
        return await createdFlow.save();
    }

    async handleActions(flowActionData: FlowActionData): Promise<void> {
        this.logger.log(`Received flow trigger ${flowActionData.actionName} for user ${flowActionData.userId}`);
        const flows: Flow[] = await this.flowModel.find({
            userId: flowActionData.userId,
            'data.nodes': {
                $elemMatch: {
                    name: flowActionData.actionName,
                }
            }
        });
        this.logger.log(`Found ${flows.length} flows`);
        for (const flow of flows)
            await this.executeFlow(flow, flowActionData);
    }

    private async executeFlow(flow: Flow, flowActionData: FlowActionData): Promise<void> {
        this.logger.log(`Executing flow ${flow._id}`);
        const nodes = flow.data.nodes.filter(node => node.name === flowActionData.actionName);
        this.logger.log(`Found ${nodes.length} nodes`);
        for (const node of nodes) {
            const edges = flow.data.edges.filter(edge => edge.source === node.id);
            this.logger.log(`Found ${edges.length} edges`);
            for (const edge of edges)
                await this.executeNode(edge.target, flowActionData);
        }
    }

    private async executeNode(node: any, flowActionData: FlowActionData): Promise<void> {
        this.logger.log(`Executing node ${node._id}`);
        const actions = node.name;
        this.logger.log(`Found ${actions.length} actions`);
        for (const action of actions) {
            this.logger.log(`Executing action ${action._id}`);
            await this.executeAction(action, flowActionData);
        }
    }

    private async executeAction(action: any, flowActionData: FlowActionData): Promise<void> {
        this.logger.log(`Executing action ${action._id}`);
        const provider = action.provider;
        const actionName = action.name;
        const data = action.data;
        this.logger.log(`Emitting action ${action._id}`);
    }
}
