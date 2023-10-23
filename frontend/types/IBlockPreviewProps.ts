import { IServiceDisplay } from "~/types/IServiceDisplay";

export interface IBlockPreviewProps {
    service: IServiceDisplay;
    name: string;
    title: string;
    description: string;
}