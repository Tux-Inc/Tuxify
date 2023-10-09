export class UserProviderTokens {
    constructor(
        public readonly accessToken: string,
        public readonly refreshToken: string,
        public readonly userId: number,
    ) {
    }
}