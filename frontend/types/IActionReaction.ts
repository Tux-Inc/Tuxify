import { IActionReactionInput } from "~/types/IActionReactionInput";
import { IActionReactionOutput } from "~/types/IActionReactionOutput";

export interface IActionReaction {
    name: string,
    type: 'action' | 'reaction',
    title: string,
    description: string,
    inputs: IActionReactionInput[],
    outputs: IActionReactionOutput<unknown>[],
    uuid?: string,
}