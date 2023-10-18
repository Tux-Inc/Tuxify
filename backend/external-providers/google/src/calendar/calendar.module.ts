import { Module } from '@nestjs/common';
import { CalendarService } from './calendar.service';

@Module({
  providers: [CalendarService]
})
export class CalendarModule {}
