import { Module } from '@nestjs/common';
import { CarteirasController } from './carteiras.controller';
import { CarteirasService } from './carteiras.service';
import { ProActiveGuard } from '../auth/pro-active.guard';

@Module({
  controllers: [CarteirasController],
  providers: [CarteirasService, ProActiveGuard],
})
export class CarteirasModule {}
