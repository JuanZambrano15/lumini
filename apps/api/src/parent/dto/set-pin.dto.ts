import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, Matches } from 'class-validator';

const PIN_PATTERN = /^\d{4,6}$/;
const PIN_MESSAGE = 'El PIN debe tener entre 4 y 6 dígitos';

export class SetPinDto {
  @ApiProperty({ example: '1234' })
  @Matches(PIN_PATTERN, { message: PIN_MESSAGE })
  pin!: string;

  @ApiPropertyOptional({ description: 'Obligatorio si ya existe un PIN', example: '0000' })
  @IsOptional()
  @Matches(PIN_PATTERN, { message: PIN_MESSAGE })
  currentPin?: string;
}

export class VerifyPinDto {
  @ApiProperty({ example: '1234' })
  @Matches(PIN_PATTERN, { message: PIN_MESSAGE })
  pin!: string;
}
