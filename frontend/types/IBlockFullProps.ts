import { IBlockPreviewProps } from "~/types/IBlockPreviewProps";
import { IActionReactionInput } from "~/types/IActionReactionInput";
import { IActionReactionOutput } from "~/types/IActionReactionOutput";

export interface IBlockFullProps extends IBlockPreviewProps {
    uuid?: string;
    type: 'action' | 'reaction';
    inputs: IActionReactionInput[];
    outputs: IActionReactionOutput<unknown>[];
}