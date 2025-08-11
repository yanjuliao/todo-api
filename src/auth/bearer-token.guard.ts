import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { ConfigService } from '@nestjs/config';
  import { Reflector } from '@nestjs/core';
  import { IS_PUBLIC_KEY } from './public.decorator';
  import type { Request } from 'express';
  
  @Injectable()
  export class BearerTokenGuard implements CanActivate {
    constructor(
      private readonly config: ConfigService,
      private readonly reflector: Reflector,
    ) {}
  
    canActivate(context: ExecutionContext): boolean {
      const req = context.switchToHttp().getRequest<Request>();
  
      const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
      if (isPublic) return true;

      const url = req.url || '';
      if (url.startsWith('/docs') || url === '/docs-json' || url === '/favicon.ico') {
        return true;
      }
  
      const header = req.headers?.authorization || '';
      if (!header.startsWith('Bearer ')) {
        throw new UnauthorizedException('unauthorized');
      }
      const token = header.slice(7).trim();
      const expected = this.config.get<string>('API_TOKEN');
  
      if (token && expected && token === expected) return true;
      throw new UnauthorizedException('unauthorized');
    }
  }