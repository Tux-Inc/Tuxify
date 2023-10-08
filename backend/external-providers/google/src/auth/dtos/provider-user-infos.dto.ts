export class ProviderUserInfos {
    constructor(
        public readonly provider: string,
        public readonly email: string,
        public readonly name: string,
        public readonly accessToken: string,
        public readonly refreshToken: string,
    ) {
    }
}