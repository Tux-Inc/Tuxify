export class ProviderRequestTokens {
    constructor(
        public readonly provider: string,
        public readonly userId: number,
    ) {
    }
}