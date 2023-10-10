export class UserResetPasswordDto {
    constructor(
        public readonly email: string,
        public readonly resetLink: string,
    ) {}
}