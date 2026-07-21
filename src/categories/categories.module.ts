import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { ProActiveGuard } from '../auth/pro-active.guard';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, ProActiveGuard],
})
export class CategoriesModule {}
