import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentChild } from '../common/decorators/current-child.decorator';
import { Public } from '../common/decorators/public.decorator';
import { ChildAccessGuard } from '../common/guards/child-access.guard';
import type { Child } from '../generated/prisma/client';
import { EquipItemDto } from './dto/equip-item.dto';
import { ShopService } from './shop.service';

@ApiTags('shop')
@Controller()
export class ShopController {
  constructor(private readonly shop: ShopService) {}

  @Get('shop/items')
  @Public()
  @ApiOperation({ summary: 'Catálogo de objetos para el avatar y la casa' })
  listItems() {
    return this.shop.listItems();
  }

  @Get('children/:childId/items')
  @ApiBearerAuth()
  @UseGuards(ChildAccessGuard)
  @ApiOperation({ summary: 'Objetos que tiene el niño y cuáles usa' })
  listOwned(@CurrentChild() child: Child) {
    return this.shop.listOwned(child);
  }

  @Post('children/:childId/items/:itemId/purchase')
  @ApiBearerAuth()
  @UseGuards(ChildAccessGuard)
  @ApiOperation({ summary: 'Compra un objeto con estrellas y lo equipa' })
  purchase(@CurrentChild() child: Child, @Param('itemId', ParseIntPipe) itemId: number) {
    return this.shop.purchase(child, itemId);
  }

  @Patch('children/:childId/items/:itemId')
  @ApiBearerAuth()
  @UseGuards(ChildAccessGuard)
  @ApiOperation({ summary: 'Equipa o guarda un objeto comprado' })
  setEquipped(
    @CurrentChild() child: Child,
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() dto: EquipItemDto,
  ) {
    return this.shop.setEquipped(child, itemId, dto.equipped);
  }
}
