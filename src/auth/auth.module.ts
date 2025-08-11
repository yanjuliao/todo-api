import { Module } from '@nestjs/common';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { BearerTokenGuard } from './bearer-token.guard';

@Module({
  providers: [
    Reflector,
    { provide: APP_GUARD, useClass: BearerTokenGuard },
  ],
})
export class AuthModule {}
