/*
File Name: flow.schema.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Schema for flow model in database
Copyright (c) 2023 Tux Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the 'Software'), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

import { v4 as uuidv4 } from "uuid";
import { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type FlowDocument = HydratedDocument<Flow>;

/* The Flow class is a TypeScript schema with various properties for representing
a flow object. */
@Schema()
export class Flow {
    @Prop({
        type: String,
        default: function genUUID() {
            return uuidv4();
        },
    })
    _id?: string;
    @Prop({ required: true })
    name: string;
    @Prop({ default: "" })
    description?: string;
    @Prop({ default: [], type: Array })
    data: any;
    @Prop({ required: true })
    userId?: number;
    @Prop({ default: false })
    enabled?: boolean;
    @Prop({ default: false })
    isValid?: boolean;
    @Prop({ required: false })
    lastRun?: Date;
    @Prop({ default: Date.now })
    createdAt?: Date;
    @Prop({ default: Date.now })
    updatedAt?: Date;
}

/* `export const FlowSchema = SchemaFactory.createForClass(Flow);` is creating a
Mongoose schema for the Flow class. */
export const FlowSchema = SchemaFactory.createForClass(Flow);
