import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Max, Min } from 'class-validator';

export class CreateGameSessionDto {
  @ApiProperty({ minimum: 0, maximum: 100, example: 80 })
  @IsInt()
  @Min(0)
  @Max(100)
  score!: number;

  @ApiProperty({ minimum: 0, maximum: 3600, example: 95 })
  @IsInt()
  @Min(0)
  @Max(3600)
  durationSec!: number;
}
