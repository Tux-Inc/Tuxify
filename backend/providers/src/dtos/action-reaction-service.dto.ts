import { ActionReaction } from "./action-reaction.dto";

export class ActionReactionService {
    constructor(
        public readonly name: string,
        public readonly image: string = '',
        public readonly title: string,
        public readonly description: string,
        public readonly actions: ActionReaction[],
        public readonly reactions: ActionReaction[],
        public readonly isConnected?: boolean,
    ) {
    }
}