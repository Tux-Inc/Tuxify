export class UserResetPasswordEvent {
    constructor(
        public readonly email: string,
        public readonly resetLink: string,
    ) {}
}