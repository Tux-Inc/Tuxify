import { Module } from '@nestjs/common';
import { FlowsController } from './flows.controller';
import { FlowsService } from './flows.service';
import {MongooseModule} from "@nestjs/mongoose";
import * as process from "process";
import {Flow, FlowSchema} from "./schemas/flow.schema";

@Module({
  imports: [
      MongooseModule.forRoot(`mongodb://${process.env.NESTSV_FLOWS_MONGO_USER}:${process.env.NESTSV_FLOWS_MONGO_PASSWORD}@${process.env.NESTSV_FLOWS_MONGO_HOST}:${process.env.NESTSV_FLOWS_MONGO_PORT}`),
      MongooseModule.forFeature([
            { name: Flow.name, schema: FlowSchema },
        ]),
  ],
  controllers: [FlowsController],
  providers: [FlowsService],
})
export class FlowsModule {}
