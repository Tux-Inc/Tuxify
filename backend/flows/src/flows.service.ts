import {Injectable, Logger} from '@nestjs/common';
import {Flow} from "./schemas/flow.schema";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";

@Injectable()
export class FlowsService {
    private readonly logger = new Logger(FlowsService.name);
    constructor(
        @InjectModel(Flow.name) private readonly flowModel: Model<Flow>,
    ) {}

    async createFlow(flow: Flow) {
        this.logger.log(`Creating flow ${flow.name}`);
        return {success: true};
    }
}
