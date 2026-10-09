import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';
import { QUESTION_MAX_LENGTH } from '../content-filter';

export class AskQuestionDto {
  @ApiProperty({ example: '¿Por qué el cielo es azul?', maxLength: QUESTION_MAX_LENGTH })
  @IsString()
  // Margen extra: el filtro de contenido da un mensaje amigable si se pasa del límite.
  @MaxLength(QUESTION_MAX_LENGTH * 2)
  question!: string;
}
