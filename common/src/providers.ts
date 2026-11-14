/** Request to link a provider account to a user. */
export class AddProvider {
    provider: string;
    userId: number;
}

/** OAuth callback received after the user authorised a provider. */
export class AddProviderCallback {
    public readonly provider: string;
    public readonly code: string;
    public readonly state: string;
}

/** Tokens obtained once a provider account is linked to a user. */
export class AddedProvider {
    public readonly accessToken: string;
    public readonly refreshToken: string;
    public readonly userId: number;
}

/** Request for the tokens of a user for a given provider. */
export class ProviderRequestTokens {
    constructor(
        public readonly provider: string,
        public readonly userId: number,
    ) {}
}

/** Profile and tokens returned by a provider after an OAuth login. */
export class ProviderUserInfos {
    constructor(
        public readonly provider: string,
        public readonly email: string,
        public readonly name: string,
        public readonly accessToken: string,
        public readonly refreshToken: string,
    ) {}
}

/** Tokens of a user for a provider. */
export class UserProviderTokens {
    constructor(
        public readonly accessToken: string,
        public readonly refreshToken: string,
        public readonly userId: number,
    ) {}
}

/** Stored link between a user and a provider, as sent over NATS. */
export class ProviderEntity {
    id: number;
    provider: string;
    accessToken: string;
    refreshToken: string;
    userId: number;
    createdAt: Date;
    updatedAt: Date;
}
