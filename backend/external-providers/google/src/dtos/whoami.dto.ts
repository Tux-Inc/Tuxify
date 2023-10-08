export class WhoAmI {
    constructor(
        public readonly identifier: string,
        public readonly title: string,
        public readonly description: string,
        public readonly image: string = '',
    ) {
    }
}