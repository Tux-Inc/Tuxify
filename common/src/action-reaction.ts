/** Name of an action that triggered a flow. */
export class ActionInfos {
    constructor(public readonly name: string) {}
}

/** Input field of an action or a reaction, as displayed by the frontend. */
export class ActionReactionInput {
    constructor(
        public readonly name: string,
        public readonly title: string,
        public readonly placeholder: string,
        public readonly required: boolean,
        public readonly value?: string,
    ) {}
}

/** Output of an action or a reaction, usable by the next steps of a flow. */
export class ActionReactionOutput<T> {
    constructor(
        public readonly name: string,
        public readonly title: string,
        public readonly value?: T,
    ) {}
}

/** An action (trigger) or a reaction exposed by a provider. */
export class ActionReaction {
    constructor(
        public readonly name: string,
        public readonly type: "action" | "reaction",
        public readonly title: string,
        public readonly description: string,
        public readonly inputs: ActionReactionInput[] = [],
        public readonly outputs: ActionReactionOutput<unknown>[] = [],
        public readonly service?: Partial<ActionReactionService>,
        public readonly uuid?: string,
    ) {}
}

/** A provider and the actions and reactions it exposes. */
export class ActionReactionService {
    constructor(
        public readonly name: string,
        public readonly image: string = "",
        public readonly title: string,
        public readonly description: string,
        public readonly actions: ActionReaction[] = [],
        public readonly reactions: ActionReaction[] = [],
        public readonly isConnected?: boolean,
    ) {}
}

/** Payload sent to a reaction: the user it runs for and its inputs. */
export class CommonReactionInput<T> {
    constructor(
        public readonly userId: number,
        public readonly input: T,
    ) {}
}
