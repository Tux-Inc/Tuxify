import { IBlockInput } from "~/types/IBlockInput";
import { IBlockOutput } from "~/types/IBlockOutput";
import { IBlockPreviewProps } from "~/types/IBlockPreviewProps";

export interface IBlockFullProps extends IBlockPreviewProps {
    uuid?: string;
    inputs: IBlockInput[];
    outputs: IBlockOutput[];
}