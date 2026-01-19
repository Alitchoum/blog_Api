import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Payload } from '../auth/jwt-payload.interface';

export const ConnectedUser = createParamDecorator(
  (_, ctx: ExecutionContext): Payload | null =>
    ctx.switchToHttp().getRequest().user ?? null,
);
