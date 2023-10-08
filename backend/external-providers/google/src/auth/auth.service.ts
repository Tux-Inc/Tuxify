import {Injectable, Logger} from '@nestjs/common';
import {AddProvider} from "./dtos/add-provider.dto";
import {AddProviderCallback} from "./dtos/add-provider-callback.dto";
import {AddedProvider} from "./dtos/added-provider.dto";
import {OAuthClass} from "./classes/oauth.class";
import {IClient} from "./interfaces/client.interface";
import {RpcException} from "@nestjs/microservices";

@Injectable()
export class AuthService {
    private google: OAuthClass | null;
    private readonly logger = new Logger(AuthService.name);

    constructor() {
    }

    async addProvider(addProvider: AddProvider): Promise<string | void> {
        this.logger.log('Sending authentication URL to client');
        this.google = AuthService.setOAuthClass('http://localhost:3000', addProvider.userId);
        return this.getAuthorizationUrl();
    }

    async addProviderCallback(addProviderCallback: AddProviderCallback): Promise<AddedProvider> {
        this.logger.log('Callback received from Google');
        const {code, state} = addProviderCallback;
        const tokensUser: AddedProvider = await this.getAccessToken(code, state);
        this.logger.log(`Tokens received from Google for user ${tokensUser.userId}`);
        return tokensUser;
    }

    private static setOAuthClass(
        url: string,
        userId: number,
    ): OAuthClass | null {
        const client: IClient = {
            id: process.env.GOOGLE_CLIENT_ID,
            secret: process.env.GOOGLE_CLIENT_SECRET,
        }

        return new OAuthClass(client, url, userId);
    }

    public getAuthorizationUrl(): string {
        return this.getOAuth().authorizationUrl;
    }

    private getOAuth(): OAuthClass {
        if (!this.google)
            throw new Error('Google OAuth2 is not configured');
        return this.google;
    }

    private async getAccessToken(
        code: string,
        state: string,
    ): Promise<AddedProvider> {
        const oauth: OAuthClass = this.getOAuth();

        if (state !== oauth.state) {
            throw new RpcException('Corrupted state');
        }

        return oauth.getToken(code, state);
    }
}
