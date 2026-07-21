import { Module } from '@nestjs/common';
import { EntriesController } from './entries.controller';
import { EntriesService } from './entries.service';
import { ProActiveGuard } from '../auth/pro-active.guard';

@Module({
  controllers: [EntriesController],
  providers: [EntriesService, ProActiveGuard],
})
export class EntriesModule {}
