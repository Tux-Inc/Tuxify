export class CreatedUserEvent {
    constructor(
        public readonly email: string,
        public readonly confirmationLink: string,
    ) {}
}