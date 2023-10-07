import { Controller } from '@nestjs/common';
import { FlowsService } from './flows.service';
import {Ctx, MessagePattern, Payload} from "@nestjs/microservices";
import {Flow} from "./schemas/flow.schema";

@Controller()
export class FlowsController {
  constructor(
      private readonly flowsService: FlowsService
  ) {}

  @MessagePattern({ cmd: 'flows.create' })
  async createFlow(@Payload() flow: Flow) {
    return this.flowsService.createFlow(flow);
  }
}
