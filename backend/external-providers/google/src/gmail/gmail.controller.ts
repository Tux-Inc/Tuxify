import { Controller } from '@nestjs/common';
import { GmailService } from "./gmail.service";
import { EventPattern } from "@nestjs/microservices";
import { AddedProvider } from "../auth/dtos/added-provider.dto";

@Controller('gmail')
export class GmailController {
    constructor(
        public readonly gmailService: GmailService,
    ) {
    }

    @EventPattern('provider.google.add.callback.success')
    async addUserToPublisher(addedProvider: AddedProvider): Promise<void> {
        return await this.gmailService.addUserToPublisher(addedProvider);
    }
}
