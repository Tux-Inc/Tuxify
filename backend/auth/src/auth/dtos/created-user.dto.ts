export class CreatedUserDto {
    constructor(
        public readonly email: string,
        public readonly confirmationLink: string,
    ) {}
}