
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

export const CurrentUser = createParamDecorator(
  (_, context: ExecutionContext): number | undefined => {
    return context.switchToHttp().getRequest<FastifyRequest>()?.user;
  },
);
