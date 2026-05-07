/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/common/interceptors/logging.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ContextType,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    let req: any;
    const contextType = context.getType<ContextType | 'graphql'>();

    if (contextType === 'http') {
      // REST/HTTP requests
      req = context.switchToHttp().getRequest();
    } else if (contextType === 'graphql') {
      // GraphQL requests
      const gqlCtx = GqlExecutionContext.create(context);
      req = gqlCtx.getContext().req;
    }

    const method = req?.method ?? 'GRAPHQL';
    const url = req?.url ?? 'GraphQL Operation';

    console.log(`Incoming request: ${method} ${url}`);

    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() => console.log(`Request completed in ${Date.now() - now}ms`)),
      );
  }
}
