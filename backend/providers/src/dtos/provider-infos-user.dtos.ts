import { ProviderInfos } from "./provider-infos.dto";

export class ProviderInfosUser extends ProviderInfos {
    constructor(
        public readonly name: string,
        public readonly title: string,
        public readonly image: string = '',
        public readonly reactions: any[],
        public readonly actions: any[],
        public readonly isConnected: boolean,
    ) {
        super(name, title, image, reactions, actions);
    }
}
