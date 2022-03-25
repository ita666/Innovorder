import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpStatus
} from '@nestjs/common';
import { Request, Response } from 'express';
import {PrismaClientKnownRequestError} from "@prisma/client/runtime";
import {LoggingService} from "../../utils/logging/logging.service";
import {
    CREDENTIALS_TAKEN_ERROR_MESSAGE,
    DATABASE_ERROR_MESSAGE
} from "../error-messages";

const UNIQUE_CONSTRAINT_FAILURE_CODE = 'P2002';

@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {

    constructor(
        private logger: LoggingService
    ) {}

    catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
        console.log('prisma')
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const code = exception.code;
        let message = DATABASE_ERROR_MESSAGE;

        if(code === UNIQUE_CONSTRAINT_FAILURE_CODE){
            message = CREDENTIALS_TAKEN_ERROR_MESSAGE;
        }

        this.logger.error(message);
        response
            .status(HttpStatus.FORBIDDEN)
            .json({
                statusCode: HttpStatus.FORBIDDEN,
                timestamp: new Date().toISOString(),
                path: request.url,
                message
            });
    }
}