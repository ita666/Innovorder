import {Injectable, LoggerService} from '@nestjs/common';
import * as winston from "winston";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class LoggingService implements LoggerService {
    private logger: winston.Logger;

    constructor(
        private config: ConfigService) {
        this.initializeLogger();
    }


    initializeLogger() {
        const loggerLevel = this.config.get("LOGGER_LEVEL");

        const appFormat = winston.format.printf(({ level, message, timestamp }) => {
            return `${timestamp} ${level}: ${message}`;
        });

        this.logger = winston.createLogger({
            level: loggerLevel,
            format: winston.format.combine(
                winston.format.timestamp(),
                appFormat),
            transports: [
                new winston.transports.File({
                    filename: `logs/${loggerLevel}.log`,
                    level: 'error'
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

    error(message: string): void {
        this.logger.error(message);
    }

    warn(message: string): void {
        this.logger.warn(message);
    }

    log(message: string): void {
        this.logger.info(message);
    }
}
