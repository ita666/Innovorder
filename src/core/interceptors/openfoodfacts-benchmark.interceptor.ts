import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {LoggingService} from "../../utils/logging/logging.service";

@Injectable()
export class OpenFoodFactsBenchmarkInterceptor implements NestInterceptor {

    constructor(
        private logger: LoggingService
    ) {
    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const now = Date.now();
        return next
            .handle()
            .pipe(
                tap(() => this.logger.log(`After... ${Date.now() - now}ms`)),
            );
    }
}