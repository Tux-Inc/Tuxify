import {Injectable, Logger} from '@nestjs/common';
import {Flow} from "./schemas/flow.schema";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import { FlowActionData } from "./events/FlowActionData.event";
import { GetFlow } from "./events/GetFlow.event";

@Injectable()
export class FlowsService {
    private readonly logger = new Logger(FlowsService.name);
    constructor(
        @InjectModel(Flow.name) private readonly flowModel: Model<Flow>,
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

    async handleActions(flowActionData: FlowActionData): Promise<void> {
        this.logger.log(`Received flow trigger ${flowActionData.actionName} for user ${flowActionData.userId}`);
        const flows: Flow[] = await this.findFlowsForUserAction(flowActionData.userId, flowActionData.actionName);
        this.logger.log(`Found ${flows.length} flows`);
        for (const flow of flows)
            await this.executeFlow(flow, flowActionData);
    }

    private createDependencyMapping(edges: any[]): Map<string, string[]> {
        const dependenciesMap: Map<string, string[]> = new Map<string, string[]>();

        for (const edge of edges) {
            const targetNode = edge.target;  // the node that depends on another
            const sourceNode = edge.source;  // the node that is being depended upon

            if (dependenciesMap.has(targetNode)) {
                dependenciesMap.get(targetNode)!.push(sourceNode);
            } else {
                dependenciesMap.set(targetNode, [sourceNode]);
            }
        }

        return dependenciesMap;
    }

    private nodeOutputs: Map<string, any> = new Map();

    private async executeFlow(flow: Flow, flowActionData: FlowActionData): Promise<void> {
        this.logger.log(`Executing flow ${flow._id}`);
        flow.lastRun = new Date();
        await this.flowModel.updateOne({_id: flow._id}, flow);
        const flowData = flow.data;

        const dependenciesMap: Map<string, string[]> = this.createDependencyMapping(flowData.edges);
        console.log(dependenciesMap);

        const executedNodes: any[] = [];
        const nodesQueue: any[] = [...flowData.nodes];

        while (nodesQueue.length > 0) {
            const node = nodesQueue.shift();
            if (this.canExecuteNode(node, executedNodes, dependenciesMap)) {
                const inputData = this.gatherNodeInputs(node, dependenciesMap);
                const nodeOutput = await this.executeNode(node, inputData, flowActionData);
                this.nodeOutputs.set(node.id, nodeOutput);
                executedNodes.push(node.id);
            } else {
                nodesQueue.push(node);
            }
        }
        delete this.nodeOutputs;
    }

    private canExecuteNode(node: any, executedNodes: any[], dependenciesMap: Map<string, string[]>): boolean {
        const nodeId = node.id;
        const nodeDependencies: string[] = dependenciesMap.get(nodeId) || [];

        for (const dependentNodeId of nodeDependencies) {
            if (!executedNodes.includes(dependentNodeId)) {
                return false;
            }
        }
        return true;
    }

    private gatherNodeInputs(node: any, dependenciesMap: Map<string, string[]>): any {
        const nodeId = node.id;
        const nodeDependencies: string[] = dependenciesMap.get(nodeId) || [];
        const inputData: {} = {};

        for (const dependentNodeId of nodeDependencies) {
            inputData[dependentNodeId] = this.nodeOutputs.get(dependentNodeId);
        }

        return inputData;
    }

    private async executeNode(node: any, inputData: any, flowActionData: FlowActionData): Promise<any> {
        console.log('flowActionData', flowActionData);
        console.log('node', node);
        console.log('inputData', inputData);
    }

    private async findFlowsForUserAction(userId: number, actionName: string): Promise<Flow[]> {
        this.logger.log(`Finding flows for user ${userId} and action ${actionName}`);
        return this.flowModel.find({
            userId,
            enabled: true,
            isValid: true,
            'data.nodes': {
                $elemMatch: {
                    name: actionName,
                }
            }
        });
    }
}
