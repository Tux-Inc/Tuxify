import { Body, Controller, Inject, Post, Req, UseGuards } from "@nestjs/common";
import {ClientProxy} from "@nestjs/microservices";
import { AuthGuard } from "../guards/auth.guard";

@Controller('flows')
export class FlowsController {
    constructor(
        @Inject('NATS_CLIENT') private readonly natsClient: ClientProxy,
    ) {}

    @UseGuards(AuthGuard)
    @Post()
    async createFlow(@Req() req: any, @Body() body: any): Promise<any> {
        const flow = {
            userId: req.user.userId,
            data: body.data,
            name: body.name,
            description: body.description,
        }
        return this.natsClient.send('flows.create' , flow);
    }
}
