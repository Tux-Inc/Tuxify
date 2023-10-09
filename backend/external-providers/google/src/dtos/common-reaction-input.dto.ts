export class CommonReactionInput<T> {
    constructor(
        public readonly userId: number,
        public readonly input: T,
    ) {
    }
}