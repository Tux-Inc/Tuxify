export class SendEmailEvent {
    constructor(
        public readonly to: string,
        public readonly subject: string,
        public readonly text: string,
        public readonly html?: string,
        public readonly template?: string,
        public readonly context?: any,
    ) {}
}