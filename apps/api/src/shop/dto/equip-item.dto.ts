import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class EquipItemDto {
  @ApiProperty({ description: 'true para usar el objeto, false para guardarlo' })
  @IsBoolean()
  equipped!: boolean;
}
