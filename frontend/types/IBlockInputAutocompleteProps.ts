import { IBlockFullProps } from "~/types/IBlockFullProps";
import { IBlockInput } from "~/types/IBlockInput";

export interface IBlockInputAutocompleteProps {
    input: IBlockInput;
    currentBlock: IBlockFullProps;
    flowBlocks: IBlockFullProps[];
}