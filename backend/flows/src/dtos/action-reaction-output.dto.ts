export class ActionReactionOutput<T> {
    constructor(
        public readonly name: string,
        public readonly title: string,
        public readonly value?: T,
    ) {
    }
}