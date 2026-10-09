import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('catalog')
@Public()
@Controller('avatars')
export class AvatarsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Catálogo de avatares disponibles' })
  list() {
    return this.prisma.avatar.findMany({ orderBy: { sortOrder: 'asc' } });
  }
}
