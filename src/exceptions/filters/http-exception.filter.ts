import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import {INVALID_TOKEN_ERROR_MESSAGE} from "../error-messages";
import {LoggingService} from "../../utils/logging/logging.service";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {

    constructor(
        private logger: LoggingService
    ) {}

    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();
        console.log(exception.message)
        let message = exception.message;

        if(exception.message === INVALID_TOKEN_ERROR_MESSAGE) {
            this.logger.error(INVALID_TOKEN_ERROR_MESSAGE);
            message = INVALID_TOKEN_ERROR_MESSAGE;
        }

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