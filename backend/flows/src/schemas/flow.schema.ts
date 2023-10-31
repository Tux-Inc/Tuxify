import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {HydratedDocument} from "mongoose";
import { v4 as uuidv4 } from 'uuid';

export type FlowDocument = HydratedDocument<Flow>

@Schema()
export class Flow {
    @Prop({ type: String, default: function genUUID() {
            return uuidv4()
        }})
    _id?: string;
    @Prop({required: true})
    name: string;
    @Prop({default: ''})
    description?: string;
    @Prop({default: [], type: Array})
    data: any;
    @Prop({required: true})
    userId?: number;
    @Prop({default: false})
    enabled?: boolean;
    @Prop({default: false})
    isValid?: boolean;
    @Prop({required: false})
    lastRun?: Date;
    @Prop({default: Date.now})
    createdAt?: Date;
    @Prop({default: Date.now})
    updatedAt?: Date;
}

export const FlowSchema = SchemaFactory.createForClass(Flow);
