import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    ForbiddenException
} from '@nestjs/common';
import { Request, Response } from 'express';
import {LoggingService} from "../../../utils/logging/logging.service";

@Catch(ForbiddenException)
export class ForbiddenExceptionFilter implements ExceptionFilter {

    constructor(
        private logger: LoggingService
    ) {}

    catch(exception: ForbiddenException, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();
        let message = exception.message;

        this.logger.error(message);

        response
            .status(status)
            .json({
                statusCode: status,
                timestamp: new Date().toISOString(),
                path: request.url,
                message
            });
    }
}