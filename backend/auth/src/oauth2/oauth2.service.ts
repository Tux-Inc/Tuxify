import {HttpService} from '@nestjs/axios';
import {Inject, Injectable, NotFoundException, UnauthorizedException,} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {AxiosError} from 'axios';
import {catchError, firstValueFrom} from 'rxjs';
import {CommonService} from '../common/common.service';
import {isNull} from '../common/utils/validation.util';
import {JwtService} from '../jwt/jwt.service';
import {OAuthProvidersEnum} from '../users/enums/oauth-providers.enum';
import {UsersService} from '../users/users.service';
import {OAuthClass} from './classes/oauth.class';
import {ICallbackQuery} from './interfaces/callback-query.interface';
import {IClient} from './interfaces/client.interface';
import {ClientProxy} from "@nestjs/microservices";
import {IAuthResponseTokensInterface} from "./interfaces/auth-response-tokens.interface";
import {LocalUserProviderTokensDto} from "./dtos/local-user-provider-tokens.dto";

@Injectable()
export class Oauth2Service {
  private readonly [OAuthProvidersEnum.MICROSOFT]: OAuthClass | null;
  private readonly [OAuthProvidersEnum.GOOGLE]: OAuthClass | null;
  private readonly [OAuthProvidersEnum.FACEBOOK]: OAuthClass | null;
  private readonly [OAuthProvidersEnum.GITHUB]: OAuthClass | null;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly commonService: CommonService,
    @Inject('NATS_CLIENT') private readonly natsClient: ClientProxy,
  ) {
    const url = configService.get<string>('url');
    this[OAuthProvidersEnum.MICROSOFT] = Oauth2Service.setOAuthClass(
      OAuthProvidersEnum.MICROSOFT,
      configService,
      url,
    );
    this[OAuthProvidersEnum.GOOGLE] = Oauth2Service.setOAuthClass(
      OAuthProvidersEnum.GOOGLE,
      configService,
      url,
    );
    this[OAuthProvidersEnum.FACEBOOK] = Oauth2Service.setOAuthClass(
      OAuthProvidersEnum.FACEBOOK,
      configService,
      url,
    );
    this[OAuthProvidersEnum.GITHUB] = Oauth2Service.setOAuthClass(
      OAuthProvidersEnum.GITHUB,
      configService,
      url,
    );
  }

  private static setOAuthClass(
    provider: OAuthProvidersEnum,
    configService: ConfigService,
    url: string,
  ): OAuthClass | null {
    const client = configService.get<IClient | null>(
      `oauth2.${provider.toLowerCase()}`,
    );

    if (isNull(client)) {
      return null;
    }

    return new OAuthClass(provider, client, url);
  }

  public getAuthorizationUrl(provider: OAuthProvidersEnum): string {
    return this.getOAuth(provider).authorizationUrl;
  }

  public async getUserData<T extends Record<string, any>>(
    provider: OAuthProvidersEnum,
    cbQuery: ICallbackQuery,
  ): Promise<T> {
    const { code, state } = cbQuery;
    const tokens = await this.getAccessToken(provider, code, state);
    const userData = await firstValueFrom(
      this.httpService
        .get<T>(this.getOAuth(provider).dataUrl, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokens.accessToken}`,
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            throw new UnauthorizedException(error.response.data);
          }),
        ),
    );
    return {...userData.data, tokens};
  }

  public async login(
    provider: OAuthProvidersEnum,
    email: string,
    name: string,
    tokens: IAuthResponseTokensInterface,
  ): Promise<[string, string]> {
    const user = await this.usersService.findOrCreate(provider, email, name);
    const localUserProviderTokens: LocalUserProviderTokensDto = {
        userId: user.id,
        provider,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
    }
    this.natsClient.emit('oauth2.user.connected', localUserProviderTokens);
    return this.jwtService.generateAuthTokens(user);
  }

  private getOAuth(provider: OAuthProvidersEnum): OAuthClass {
    const oauth = this[provider];

    if (isNull(oauth)) {
      throw new NotFoundException('Page not found');
    }

    return oauth;
  }

  private async getAccessToken(
    provider: OAuthProvidersEnum,
    code: string,
    state: string,
  ): Promise<IAuthResponseTokensInterface> {
    const oauth = this.getOAuth(provider);

    if (state !== oauth.state) {
      throw new UnauthorizedException('Corrupted state');
    }

    return await this.commonService.throwInternalError(oauth.getToken(code));
  }
}
