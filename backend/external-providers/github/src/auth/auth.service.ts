import { Injectable, Logger } from "@nestjs/common";
import { OAuthClass } from "./classes/oauth.class";
import { AddProvider } from "./dtos/add-provider.dto";
import { AddProviderCallback } from "./dtos/add-provider-callback.dto";
import { AddedProvider } from "./dtos/added-provider.dto";
import { ProviderEntity } from "./dtos/provider.dto";
import { IClient } from "./interfaces/client.interface";
import { RpcException } from "@nestjs/microservices";
import { HttpService } from "@nestjs/axios";

@Injectable()
export class AuthService {
    private github: OAuthClass | null;
    private readonly logger: Logger = new Logger(AuthService.name);

    constructor(
        public readonly httpService: HttpService,
    ) {
    }

    async addProvider(addProvider: AddProvider): Promise<string> {
        this.logger.log('Sending authentication URL to client');
        this.github = AuthService.setOAuthClass(process.env.API_BASE_URL, addProvider.userId, this.httpService);
        return this.getAuthorizationUrl();
    }

    async addProviderCallback(addProviderCallback: AddProviderCallback): Promise<AddedProvider> {
        this.logger.log('Callback received from Github');
        const { code, state } = addProviderCallback;
        const tokensUser: AddedProvider = await this.getAccessToken(code, state);
        this.logger.log(`Tokens received from Github for user ${tokensUser.userId}`);
        return tokensUser;
    }

    async refreshTokens(providerEntity: ProviderEntity): Promise<ProviderEntity> {

        const { refreshToken } = providerEntity;
        this.github = AuthService.setOAuthClass(process.env.API_BASE_URL, providerEntity.userId, this.httpService);
        return await this.github.refreshTokens(providerEntity);
    }

    private static setOAuthClass(url: string, userId: number, httpService: HttpService): OAuthClass | null {
        const client: IClient = {
            id: process.env.GH_CLIENT_ID,
            secret: process.env.GH_CLIENT_SECRET,
        }
        return new OAuthClass(client, url, userId, httpService);
    }

    public getAuthorizationUrl(): string {
        return this.getOAuth().authorizationUrl;
    }

    private getOAuth(): OAuthClass {
        if (!this.github)
            throw new Error('Github OAuth2 is not configured');
        return this.github;
    }

    private async getAccessToken(code: string, state: string): Promise<AddedProvider> {
        const oauth: OAuthClass = this.getOAuth();
        if (state !== oauth.state)
            throw new RpcException('Corrupted state');
        return oauth.getToken(code, state);
    }
}