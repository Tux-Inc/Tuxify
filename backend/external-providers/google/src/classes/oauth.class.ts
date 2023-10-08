
import { randomBytes } from 'crypto';
import { AuthorizationCode } from 'simple-oauth2';
import { IAuthParams } from '../interfaces/auth-params.interface';
import { IClient } from '../interfaces/client.interface';
import { IProvider } from '../interfaces/provider.interface';
import {AddedProvider} from "../dtos/added-provider.dto";

export class OAuthClass {
    private static readonly authProviderEndpoints: IProvider = {
        authorizeHost: 'https://accounts.google.com',
        authorizePath: '/o/oauth2/v2/auth?access_type=offline&',
        tokenHost: 'https://www.googleapis.com',
        tokenPath: '/oauth2/v4/token',
    };

    private readonly code: AuthorizationCode;
    private readonly authorization: IAuthParams;
    private readonly userDataUrl: string;

    constructor(
        private readonly client: IClient,
        private readonly url: string,
        private readonly userId: number,
    ) {

        this.code = new AuthorizationCode({
            client,
            auth: OAuthClass.authProviderEndpoints,
        });
        this.authorization = OAuthClass.genAuthorization(url, userId);
        this.userDataUrl = 'https://www.googleapis.com/oauth2/v3/userinfo';
    }

    public get state(): string {
        return this.authorization.state;
    }

    public get dataUrl(): string {
        return this.userDataUrl;
    }

    public get authorizationUrl(): string {
        return this.code.authorizeURL(this.authorization);
    }

    private static genAuthorization(
        url: string,
        userId: number,
    ): IAuthParams {
        const redirect_uri = `${url}/providers/google/callback`;
        const state = `${randomBytes(16).toString('hex')}-${userId}`;
        return {
            state,
            redirect_uri,
            scope: [
                'https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/userinfo.profile',
            ],
        };
    }

    public async getToken(code: string, state: string): Promise<AddedProvider> {
        const result = await this.code.getToken({
            code,
            redirect_uri: this.authorization.redirect_uri,
            scope: this.authorization.scope,
        });
        const decodedState = state.split('-');
        const userId = Number(decodedState[decodedState.length - 1]);
        return {
            accessToken: result.token.access_token as string,
            refreshToken: result.token.refresh_token as string,
            userId,
        };
    }
}
