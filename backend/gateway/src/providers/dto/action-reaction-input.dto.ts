export class ActionReactionInput {
    constructor(
        public readonly name: string,
        public readonly title: string,
        public readonly placeholder: string,
        public readonly required: boolean,
        public readonly value?: string,
    ) {
    }
}