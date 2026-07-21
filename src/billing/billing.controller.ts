import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { BillingService } from './billing.service';
import { BillingSyncDto } from './dto/billing-sync.dto';

@UseGuards(JwtAuthGuard)
@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post('sync')
  sync(@CurrentUser() userId: string, @Body() dto: BillingSyncDto) {
    return this.billingService.sincronizar(userId, dto);
  }
}
