import { ActionReactionOutput } from "./action-reaction-output.dto";
import { ActionReactionInput } from "./action-reaction-input.dto";
import { ActionReactionService } from "./action-reaction-service.dto";

export class ActionReaction {
    constructor(
        public readonly name: string,
        public readonly type: 'action' | 'reaction',
        public readonly title: string,
        public readonly description: string,
        public readonly inputs: ActionReactionInput[] = [],
        public readonly outputs: ActionReactionOutput<unknown>[] = [],
        public readonly service?: Partial<ActionReactionService>,
        public readonly uuid?: string,
    ) {
    }
}