import { Controller, Logger } from "@nestjs/common";
import { FlowsService } from './flows.service';
import { Ctx, EventPattern, MessagePattern, Payload } from "@nestjs/microservices";
import {Flow} from "./schemas/flow.schema";
import { FlowActionData } from "./events/FlowActionData.event";

@Controller()
export class FlowsController {
  constructor(
      private readonly flowsService: FlowsService
  ) {}

  @MessagePattern('flows.create')
  async createFlow(@Payload() flow: Flow): Promise<Flow> {
    return this.flowsService.createFlow(flow);
  }

  @EventPattern('flows.actions.*')
  async handleActions(@Payload() flowActionData: FlowActionData) {
    this.flowsService.handleActions(flowActionData);
  }
}
