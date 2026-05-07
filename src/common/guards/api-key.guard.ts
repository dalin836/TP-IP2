/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/common/guards/api-key.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // ✅ Convert to GraphQL context
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;

    // Now req.headers is defined
    const apiKey = req.headers['x-api-key'];
    return apiKey === 'my-secret-key'; // replace with your logic
  }
}
