import {Injectable} from '@nestjs/common';
import {LocalUserProviderTokens} from "./events/local-user-provider-tokens.event";
import {InjectRepository} from "@nestjs/typeorm";
import {FlowProviderEntity} from "./entities/flow-provider.entity";
import {Repository} from "typeorm";

@Injectable()
export class FlowsProvidersService {
    constructor(
        @InjectRepository(FlowProviderEntity)
        private flowsProvidersRepository: Repository<FlowProviderEntity>,
    ) {
    }

    async findOneOrCreate(localUserProviderTokens: LocalUserProviderTokens): Promise<void> {
        const {provider, userId, accessToken, refreshToken} = localUserProviderTokens;
        const existingFlowProvider: FlowProviderEntity = await this.flowsProvidersRepository.findOne({where: {provider, userId}});
        console.log('existingFlowProvider', existingFlowProvider);
        if (existingFlowProvider) {
            existingFlowProvider.accessToken = accessToken;
            existingFlowProvider.refreshToken = refreshToken;
            await this.flowsProvidersRepository.save(existingFlowProvider);
            return;
        }
        const newFlowProvider: FlowProviderEntity = new FlowProviderEntity();
        newFlowProvider.provider = provider;
        newFlowProvider.userId = userId;
        newFlowProvider.accessToken = accessToken;
        newFlowProvider.refreshToken = refreshToken;
        console.log('newFlowProvider', newFlowProvider);
        await this.flowsProvidersRepository.save(newFlowProvider);
    }
}
