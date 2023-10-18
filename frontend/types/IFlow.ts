export interface IFlow {
    _id?: string;
    name: string;
    description?: string;
    data?: any;
    userId?: number;
    enabled?: boolean;
    isValid?: boolean;
    lastRun?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}