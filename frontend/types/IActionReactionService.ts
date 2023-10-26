import { IActionReaction } from "~/types/IActionReaction";

export interface IActionReactionService {
    name: string,
    image: string,
    title: string,
    description: string,
    actions: IActionReaction[],
    reactions: IActionReaction[],
    isConnected?: boolean
}