export class CommonActionInput<T> {
    constructor(
        public readonly userId: number,
        public readonly input: T,
    ) {
    }
}