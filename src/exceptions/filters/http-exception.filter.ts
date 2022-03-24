import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import {INVALID_TOKEN_ERROR_MESSAGE} from "../error-messages";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();
        console.log(exception.message)
        let message = "Vous avez merdé"
        if(exception.message === INVALID_TOKEN_ERROR_MESSAGE) {
            console.log("log here the stuff")
            message = INVALID_TOKEN_ERROR_MESSAGE;
        }
        response
            .status(status)
            .json({
                statusCode: status,
                timestamp: new Date().toISOString(),
                path: request.url,
                message: message
            });
    }
}