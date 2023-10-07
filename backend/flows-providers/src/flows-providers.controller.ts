import {Controller} from '@nestjs/common';
import {FlowsProvidersService} from './flows-providers.service';
import {EventPattern, Payload} from "@nestjs/microservices";
import {LocalUserProviderTokens} from "./events/local-user-provider-tokens.event";

@Controller()
export class FlowsProvidersController {
    constructor(private readonly appService: FlowsProvidersService) {
    }

    @EventPattern('oauth2.user.connected')
    async findOneOrCreate(@Payload() localUserProviderTokens: LocalUserProviderTokens): Promise<void> {
        return await this.appService.findOneOrCreate(localUserProviderTokens);
    }
}
