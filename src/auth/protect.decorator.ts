import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

export function Protect() {
  return applyDecorators(
    ApiBearerAuth(),
    UseGuards(AuthGuard),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}
