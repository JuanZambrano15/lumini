import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Length, Min } from 'class-validator';
import { Gender, SupportNeed } from '../../generated/prisma/enums';

export class CreateChildDto {
  @ApiProperty({ example: 'Sofía' })
  @IsString()
  @Length(1, 40, { message: 'El nombre debe tener entre 1 y 40 caracteres' })
  name!: string;

  @ApiPropertyOptional({ enum: Gender, default: Gender.UNSPECIFIED })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional({ enum: SupportNeed, default: SupportNeed.NONE })
  @IsOptional()
  @IsEnum(SupportNeed)
  supportNeed?: SupportNeed;

  @ApiPropertyOptional({ description: 'Si no se envía se asigna el primero del catálogo' })
  @IsOptional()
  @IsInt()
  @Min(1)
  avatarId?: number;
}

export class UpdateChildDto extends PartialType(CreateChildDto) {}

export class ChildSettingsDto {
  @ApiPropertyOptional({ description: 'Permite al niño hacerle preguntas a Lumi (IA)' })
  @IsOptional()
  @IsBoolean()
  aiEnabled?: boolean;
}
