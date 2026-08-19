import { Module } from '@nestjs/common';
import { SubtasksService } from './subtasks.service';
import { SubtasksController } from './subtasks.controller';
import { ActivitiesModule } from '../activities/activities.module';

@Module({
  imports: [ActivitiesModule],
  controllers: [SubtasksController],
  providers: [SubtasksService],
  exports: [SubtasksService],
})
export class SubtasksModule {}
