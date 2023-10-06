import { Controller } from '@nestjs/common';
import { FlowsService } from './flows.service';
import {Ctx, MessagePattern, Payload} from "@nestjs/microservices";

@Controller()
export class FlowsController {
  constructor(
      private readonly flowsService: FlowsService
  ) {}

  @MessagePattern({ cmd: 'flows.create' })
  async createFlow(@Payload() data: any,  @Ctx() context: any) {
    return this.flowsService.createFlow(data, context);
  }
}
