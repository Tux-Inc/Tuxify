import { IActionDisplay } from "~/types/IActionDisplay";
import { IReactionDisplay } from "~/types/IReactionDisplay";

export interface IServiceDisplay {
    image: string,
    name: string,
    title: string,
    description: string,
    isConnected: boolean,
    actions: IActionDisplay[],
    reactions: IReactionDisplay[],
}
