import {Inject, Injectable} from '@nestjs/common';
import {ClientProxy} from "@nestjs/microservices";
import {ProviderRequestTokens} from "../actions/dtos/provider-request-tokens.dto";
import {lastValueFrom} from "rxjs";
import {UserProviderTokens} from "./dtos/user-provider-tokens.dto";

@Injectable()
export class TokensService {
    constructor(
        @Inject('NATS_CLIENT') private readonly natsClient: ClientProxy,
    ) {
    }

    public async getTokens(userId: number): Promise<UserProviderTokens> {
        const providerRequestTokens: ProviderRequestTokens = {
            provider: 'google',
            userId,
        }
        return lastValueFrom<UserProviderTokens>(this.natsClient.send('providers.google.getTokens', providerRequestTokens));
    }
}
