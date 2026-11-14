/** Parameters of an OAuth authorisation request. */
export interface IAuthParams {
    readonly redirect_uri: string;
    readonly scope: string | string[];
    readonly state: string;
}

/** OAuth client credentials. */
export interface IClient {
    readonly id: string;
    readonly secret: string;
    readonly secretParamName?: string | undefined;
    readonly idParamName?: string | undefined;
}

/** OAuth endpoints of a provider. */
export interface IProvider {
    readonly tokenHost: string;
    readonly tokenPath: string;
    readonly authorizeHost: string;
    readonly authorizePath: string;
    readonly refreshPath?: string;
    readonly revokePath?: string;
}
