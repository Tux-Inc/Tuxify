import { Controller, Logger } from "@nestjs/common";
import { FlowsService } from './flows.service';
import { Ctx, EventPattern, MessagePattern, Payload } from "@nestjs/microservices";
import {Flow} from "./schemas/flow.schema";
import { FlowActionData } from "./events/FlowActionData.event";
import { GetFlow } from "./events/GetFlow.event";

@Controller()
export class FlowsController {
  constructor(
      private readonly flowsService: FlowsService
  ) {}

  @MessagePattern('flows.get')
  async getFlows(@Payload() userId: number): Promise<Flow[]> {
      return this.flowsService.getFlows(userId);
  }

  @MessagePattern('flow.create')
  async createFlow(@Payload() flow: Flow): Promise<Flow> {
    return this.flowsService.createFlow(flow);
  }

  @MessagePattern('flow.get')
  async getFlow(@Payload() getFlow: GetFlow): Promise<Flow> {
      return this.flowsService.getFlow(getFlow);
  }

  @MessagePattern('flow.update')
  async updateFlow(@Payload() flow: Flow): Promise<Flow> {
      return this.flowsService.updateFlow(flow);
  }

  @MessagePattern('flow.delete')
  async deleteFlow(@Payload() getFlow: GetFlow): Promise<Flow> {
      return this.flowsService.deleteFlow(getFlow);
  }

  @EventPattern('flows.actions')
  async handleActions(@Payload() flowActionData: FlowActionData): Promise<string> {
    return this.flowsService.handleActions(flowActionData);
  }
}
