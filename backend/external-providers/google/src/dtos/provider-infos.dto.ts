import {ActionInfos} from "./action-infos.dto";
import {TriggerInfos} from "./trigger-infos.dto";

export class ProviderInfos {
    constructor(
        public readonly name: string,
        public readonly title: string,
        public readonly image: string = '',
        public readonly actions: ActionInfos[],
        public readonly triggers: TriggerInfos[],
    ) {
    }
}