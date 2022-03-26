import {Injectable, LoggerService} from '@nestjs/common';
import * as winston from "winston";
import {ConfigService} from "@nestjs/config";
import path from "path";

@Injectable()
export class LoggingService implements LoggerService {
    private logger: winston.Logger;

    constructor(
        private config: ConfigService) {
        this.initializeLogger();
    }


    initializeLogger() {
        const myFormat = winston.format.printf(({ level, message, timestamp }) => {
            return `${timestamp} ${level}: ${message}`;
        });

        this.logger = winston.createLogger({
            level: this.config.get("LOGGER_LEVEL"),
            format: winston.format.combine(
                winston.format.timestamp(),
                myFormat),
            transports: [
                new winston.transports.File({
                    dirname: path.join(__dirname, './../log/debug/'),
                    filename: 'logs/debug.log',
                    level: 'debug'
                }),
                new winston.transports.File({
                    filename: 'logs/error.log',
                    level: 'error'
                }),
                new winston.transports.File({
                    dirname: path.join(__dirname, './../log/info/'),
                    filename: 'logs/info.log',
                    level: 'info'
                })
            ],
            exceptionHandlers: [
                new winston.transports.File({ filename: 'logs/exceptions.log' }),
            ]
        });

        process.on('unhandledRejection', (ex) => {
            throw ex;
        });

        if (process.env.NODE_ENV !== 'production') {
            this.logger.add(
                new winston.transports.Console({
                    format: winston.format.simple(),
                    level: 'error'
                }),
            );
        }
    }

    error(message: string) {
        this.logger.error(message);
    }

    warn(message: string) {
        this.logger.warn(message);
    }

    log(message: string) {
        this.logger.info(message);
    }
}
