import { Module } from '@nestjs/common';
import { VoterRegistrationService } from './voter-registration.service';
import { VoterRegistrationController } from './voter-registration.controller';

@Module({
  controllers: [VoterRegistrationController],
  providers: [VoterRegistrationService],
})
export class VoterRegistrationModule {}
