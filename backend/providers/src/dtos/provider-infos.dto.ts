import {ReactionInfos} from "./reaction-infos.dto";
import {ActionInfos} from "./action-infos.dto";

export class ProviderInfos {
    constructor(
        public readonly name: string,
        public readonly title: string,
        public readonly image: string = '',
        public readonly reactions: ReactionInfos[],
        public readonly actions: ActionInfos[],
    ) {
    }
}
