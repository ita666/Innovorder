import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpStatus
} from '@nestjs/common';
import { Request, Response } from 'express';
import {PrismaClientKnownRequestError} from "@prisma/client/runtime";

const UNIQUE_CONSTRAINT_FAILURE_CODE = 'P2002';

@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
    catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
        console.log('prisma')
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const code = exception.code;

        if(code === UNIQUE_CONSTRAINT_FAILURE_CODE){
            return response
                .status(HttpStatus.FORBIDDEN)
                .json({
                    statusCode: HttpStatus.FORBIDDEN,
                    timestamp: new Date().toISOString(),
                    path: request.url,
                    message: "Credentials already taken"
                });
        }

        console.log(response)
        response
            .status(HttpStatus.FORBIDDEN)
            .json({
                statusCode: HttpStatus.FORBIDDEN,
                timestamp: new Date().toISOString(),
                path: request.url,
                message: "Error querrying the DB"
            });
    }
}