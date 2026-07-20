import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { EntryType } from '@prisma/client';

export class CreateEntryDto {
  @IsEnum(EntryType)
  type: EntryType;

  @IsString()
  texto: string;

  @IsOptional()
  @IsNumber()
  valor?: number;

  @IsOptional()
  @IsString()
  categoria?: string;

  @IsDateString()
  timestamp: string;
}
