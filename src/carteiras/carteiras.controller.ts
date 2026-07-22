import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProActiveGuard } from '../auth/pro-active.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { CarteirasService } from './carteiras.service';
import { CreateCarteiraDto } from './dto/create-carteira.dto';

// Backup na nuvem (todo esse controller) é exclusivo do plano PRO — ver
// EntriesController/CategoriesController.
@UseGuards(JwtAuthGuard, ProActiveGuard)
@Controller('carteiras')
export class CarteirasController {
  constructor(private readonly carteirasService: CarteirasService) {}

  @Get()
  findAll(@CurrentUser() userId: string) {
    return this.carteirasService.findAll(userId);
  }

  @Post()
  create(@CurrentUser() userId: string, @Body() dto: CreateCarteiraDto) {
    return this.carteirasService.create(userId, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() userId: string, @Param('id') id: string) {
    return this.carteirasService.remove(userId, id);
  }
}
