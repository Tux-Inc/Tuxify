export interface IFlow {
    _id?: string;
    name: string;
    description?: string;
    data?: any;
    userId?: number;
    enabled?: boolean;
    isValidate?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}