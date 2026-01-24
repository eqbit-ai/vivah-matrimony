import { Module } from '@nestjs/common';
import { InterestsController } from './interests.controller';
import { InterestsService } from './interests.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [NotificationsModule, EmailModule],
  controllers: [InterestsController],
  providers: [InterestsService],
  exports: [InterestsService],
})
export class InterestsModule {}
