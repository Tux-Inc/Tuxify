import { Injectable } from '@nestjs/common';

@Injectable()
export class FlowsService {
    async createFlow(data: any, context: any) {
        return {success: true};
    }
}
