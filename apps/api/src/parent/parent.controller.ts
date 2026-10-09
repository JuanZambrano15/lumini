import { Body, Controller, HttpCode, HttpStatus, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/types/authenticated-request';
import { SetPinDto, VerifyPinDto } from './dto/set-pin.dto';
import { ParentService } from './parent.service';

/** Un PIN de 4 dígitos es fácil de adivinar: limitamos fuertemente los intentos. */
const PIN_THROTTLE = { default: { limit: 5, ttl: 60_000 } };

@ApiTags('parent')
@ApiBearerAuth()
@Controller('parent')
export class ParentController {
  constructor(private readonly parent: ParentService) {}

  @Put('pin')
  @Throttle(PIN_THROTTLE)
  @ApiOperation({ summary: 'Crea o cambia el PIN de la zona de padres' })
  setPin(@CurrentUser() user: AuthUser, @Body() dto: SetPinDto) {
    return this.parent.setPin(user.id, dto.pin, dto.currentPin);
  }

  @Post('session')
  @HttpCode(HttpStatus.OK)
  @Throttle(PIN_THROTTLE)
  @ApiOperation({ summary: 'Verifica el PIN y devuelve un token de modo padres' })
  openSession(@CurrentUser() user: AuthUser, @Body() dto: VerifyPinDto) {
    return this.parent.verifyPin(user.id, dto.pin);
  }
}
