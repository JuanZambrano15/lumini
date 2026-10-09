import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateMeDto {
  @ApiPropertyOptional({ example: 'Familia Pérez' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  name?: string;
}
