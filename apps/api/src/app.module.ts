import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { AvatarsModule } from './avatars/avatars.module';
import { ChildrenModule } from './children/children.module';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { ChildAccessGuard } from './common/guards/child-access.guard';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { ParentModeGuard } from './common/guards/parent-mode.guard';
import { type Env, validateEnv } from './config/env';
import { GamesModule } from './games/games.module';
import { HealthModule } from './health/health.module';
import { LearningModule } from './learning/learning.module';
import { LumiModule } from './lumi/lumi.module';
import { ParentModule } from './parent/parent.module';
import { PrismaModule } from './prisma/prisma.module';
import { ShopModule } from './shop/shop.module';
import { StarsModule } from './stars/stars.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService<Env, true>) => ({
        secret: config.get('JWT_ACCESS_SECRET', { infer: true }),
      }),
    }),
    // Límite general: 120 peticiones por minuto por IP. Las rutas sensibles lo endurecen.
    ThrottlerModule.forRoot([{ name: 'default', ttl: 60_000, limit: 120 }]),
    PrismaModule,
    StarsModule,
    HealthModule,
    AuthModule,
    UsersModule,
    ParentModule,
    AvatarsModule,
    ChildrenModule,
    LearningModule,
    GamesModule,
    ShopModule,
    LumiModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_FILTER, useClass: PrismaExceptionFilter },
    ChildAccessGuard,
    ParentModeGuard,
  ],
})
export class AppModule {}
