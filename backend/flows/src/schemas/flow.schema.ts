import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {HydratedDocument} from "mongoose";

export type FlowDocument = HydratedDocument<Flow>

@Schema()
export class Flow {
    @Prop({required: true})
    name: string;
    @Prop()
    description: string;
    @Prop()
    steps: any[];
    @Prop({required: true})
    userId: string;
    @Prop()
    createdAt: Date;
    @Prop()
    updatedAt: Date;
}

export const FlowSchema = SchemaFactory.createForClass(Flow);