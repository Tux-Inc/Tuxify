import { IBlockFullProps } from "~/types/IBlockFullProps";

export interface IFlow {
    _id?: string;
    name: string;
    description?: string;
    data: IBlockFullProps[];
    userId?: number;
    enabled?: boolean;
    isValid?: boolean;
    lastRun?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}