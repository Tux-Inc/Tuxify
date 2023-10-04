import { Module } from '@nestjs/common';
import { EmailVerificationService } from './emailVerification.service';

@Module({
  providers: [EmailVerificationService]
})
export class EmailVerificationModule {}
