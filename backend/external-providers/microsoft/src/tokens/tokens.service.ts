import { Inject, Injectable, Logger } from "@nestjs/common";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { UserProviderTokens } from "./dtos/user-provider-tokens.dto";
import { lastValueFrom } from "rxjs";
import { ProviderRequestTokens } from "./dtos/provider-request-tokens.dto";
import { ProviderEntity } from "../auth/dtos/provider.dto";

@Injectable()
export class TokensService {
    public readonly logger: Logger = new Logger(TokensService.name);
    constructor(
        @Inject('NATS_CLIENT') private readonly natsClient: ClientProxy,
    ) {
    }

    public async getTokens(userId: number): Promise<UserProviderTokens> {
        try {
            const providerRequestTokens: ProviderRequestTokens = {
                provider: 'microsoft',
                userId,
            }
            return lastValueFrom<UserProviderTokens>(this.natsClient.send('providers.microsoft.getTokens', providerRequestTokens));
        } catch (err) {
            throw new RpcException(err);
        }

    }

    public async getAllTokens(): Promise<ProviderEntity[]> {
        try {
            const usersProviderTokensObservable= this.natsClient.send('providers.microsoft.getAllTokens', 'microsoft');
            return lastValueFrom<ProviderEntity[]>(usersProviderTokensObservable);
        } catch (err) {
            throw new RpcException(err);
        }
    }
}
