import { Module } from '@nestjs/common';
import { ResetPasswordService } from './resetPassword.service';

@Module({
  providers: [ResetPasswordService]
})
export class ResetPasswordModule {}
