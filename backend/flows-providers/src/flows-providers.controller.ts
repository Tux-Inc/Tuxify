import { Controller } from '@nestjs/common';
import { FlowsProvidersService } from './flows-providers.service';
import {EventPattern, Payload} from "@nestjs/microservices";

@Controller()
export class FlowsProvidersController {
  constructor(private readonly appService: FlowsProvidersService) {}

  @EventPattern('oauth2.user.created')
    async add(@Payload() data: any) {
        console.log('oauth2.user.created', data);
    }
}
