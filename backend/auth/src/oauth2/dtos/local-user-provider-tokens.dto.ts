export class LocalUserProviderTokensDto {
    public readonly userId: number;
    public readonly provider: string;
    public readonly accessToken: string;
    public readonly refreshToken: string;
}