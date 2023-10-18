import { Body, Controller, Get, Inject, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import {ClientProxy} from "@nestjs/microservices";
import { AuthGuard } from "../guards/auth.guard";

@Controller('flows')
export class FlowsController {
    constructor(
        @Inject('NATS_CLIENT') private readonly natsClient: ClientProxy,
    ) {}

    @UseGuards(AuthGuard)
    @Post()
    async createFlow(@Req() req: any, @Body() flow: any): Promise<any> {
        flow.userId = req.user;
        return this.natsClient.send('flows.create' , flow);
    }

    @UseGuards(AuthGuard)
    @Get(':id')
    async getFlow(@Param('id') id: string, @Req() req: any): Promise<any> {
        return this.natsClient.send('flows.get' , {id, userId: req.user});
    }

    @UseGuards(AuthGuard)
    @Put(':id')
    async updateFlow(@Param('id') id: string, @Req() req: any, @Body() flow: any): Promise<any> {
        flow.userId = req.user;
        flow._id = id;
        return this.natsClient.send('flows.update' , flow);
    }
}
