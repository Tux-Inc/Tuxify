
import { randomBytes } from 'crypto';
import { AuthorizationCode } from 'simple-oauth2';
import { IAuthParams } from '../interfaces/auth-params.interface';
import { IClient } from '../interfaces/client.interface';
import { IProvider } from '../interfaces/provider.interface';
import {AddedProvider} from "../dtos/added-provider.dto";
import { HttpService } from "@nestjs/axios";
import { ProviderEntity } from "../dtos/provider.dto";
import { Logger } from "@nestjs/common";
import * as process from "process";
import { RpcException } from "@nestjs/microservices";

export class OAuthClass {
    public readonly logger: Logger = new Logger(OAuthClass.name);
    private static readonly authProviderEndpoints: IProvider = {
        authorizeHost: 'https://github.com',
        authorizePath: '/login/oauth/authorize',
        tokenHost: 'https://github.com',
        tokenPath: '/login/oauth/access_token',
    };

    private static readonly scopes: string[] = [
        'user:email',
        'read:user',
        'repo',
        'repo:status',
        'repo_deployment',
        'public_repo',
        'repo:invite',
        'security_events',
    ];

    private readonly refreshTokensPath: string = 'https://github.com/login/oauth/access_token';
    private readonly infoTokensPath: string = 'https://api.github.com/user';

    private readonly code: AuthorizationCode;
    private readonly authorization: IAuthParams;

    constructor(
        private readonly client: IClient,
        private readonly url: string,
        private readonly userId: number,
        private readonly httpService: HttpService,
    ) {

        this.code = new AuthorizationCode({
            client,
            auth: OAuthClass.authProviderEndpoints,
        });
        this.authorization = OAuthClass.genAuthorization(url, userId);
    }

    public get state(): string {
        return this.authorization.state;
    }

    public get authorizationUrl(): string {
        return this.code.authorizeURL(this.authorization);
    }

    private static genAuthorization(
        url: string,
        userId: number,
    ): IAuthParams {
        const redirect_uri: string = `${url}/providers/github/callback`;
        const state: string = `${randomBytes(16).toString('hex')}-${userId}`;
        return {
            state,
            redirect_uri,
            scope: OAuthClass.scopes
        };
    }

    public async getToken(code: string, state: string): Promise<AddedProvider> {
        const result = await this.code.getToken({
            code,
            redirect_uri: this.authorization.redirect_uri,
            scope: this.authorization.scope,
        });
        const userId: number = this.getUserIdFromState(state);
        return {
            accessToken: result.token.access_token as string,
            refreshToken: result.token.refresh_token as string,
            userId,
        };
    }

    public async refreshTokens(providerEntity: ProviderEntity): Promise<ProviderEntity> {
        const response = await this.httpService.post(
            `${this.refreshTokensPath}?client_id=${process.env.GH_CLIENT_ID}&client_secret=${process.env.GH_CLIENT_SECRET}&refresh_token=${providerEntity.refreshToken}&grant_type=refresh_token`,
        ).toPromise();
        if (response.data.includes('error')) {
            return null;
        }
        const responseArray: string[] = response.data.split('&');
        const accessToken: string = responseArray[0].split('=')[1];
        const refreshToken: string = responseArray[2].split('=')[1];
        providerEntity.accessToken = accessToken;
        providerEntity.refreshToken = refreshToken;
        return providerEntity;
    }
    private getUserIdFromState(state: string): number {
        const decodedState: string[] = state.split('-');
        return Number(decodedState[decodedState.length - 1]);
    }

}
