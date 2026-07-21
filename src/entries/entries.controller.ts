import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { EntriesService } from './entries.service';
import { CreateEntryDto } from './dto/create-entry.dto';

@UseGuards(JwtAuthGuard)
@Controller('entries')
export class EntriesController {
  constructor(private readonly entriesService: EntriesService) {}

  @Get()
  findAll(@CurrentUser() userId: string) {
    return this.entriesService.findAll(userId);
  }

  @Post()
  create(@CurrentUser() userId: string, @Body() dto: CreateEntryDto) {
    return this.entriesService.create(userId, dto);
  }

  @Patch(':id')
  update(
    @CurrentUser() userId: string,
    @Param('id') id: string,
    @Body() dto: CreateEntryDto,
  ) {
    return this.entriesService.update(userId, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() userId: string, @Param('id') id: string) {
    return this.entriesService.remove(userId, id);
  }
}
