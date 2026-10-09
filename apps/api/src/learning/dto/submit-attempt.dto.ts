import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsInt, Min } from 'class-validator';

export class SubmitAttemptDto {
  @ApiProperty({
    type: [Number],
    description: 'Índice de la opción elegida en cada pregunta',
    example: [0, 2, 1],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  @IsInt({ each: true })
  @Min(0, { each: true })
  answers!: number[];
}
