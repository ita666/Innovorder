import {
    Test,
    TestingModule
} from '@nestjs/testing';
import {
    HttpStatus,
    ArgumentsHost
} from '@nestjs/common';
import {
    PrismaExceptionFilter,
    UNIQUE_CONSTRAINT_FAILURE_CODE
} from "./prisma-exception.filter";
import {LoggingService} from "../../../utils/logging/logging.service";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime";
import {CREDENTIALS_TAKEN_ERROR_MESSAGE} from "../error-messages";


const mockLoggerService = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
};
const mockJson = jest.fn();
const mockStatus = jest.fn().mockImplementation(() => ({
    json: mockJson
}));
const mockGetResponse = jest.fn().mockImplementation(() => ({
    status: mockStatus
}));
const mockGetRequest = jest.fn().mockImplementation(() => ({
    url: 'mockUrl'
}));
const mockHttpArgumentsHost = jest.fn().mockImplementation(() => ({
    getResponse: mockGetResponse,
    getRequest: mockGetRequest
}));


const mockArgumentsHost: ArgumentsHost = {
    switchToHttp: mockHttpArgumentsHost,
    getArgByIndex: jest.fn(),
    getArgs: jest.fn(),
    getType: jest.fn(),
    switchToRpc: jest.fn(),
    switchToWs: jest.fn()
};

describe('Jwt exception filter service', () => {
    let service: PrismaExceptionFilter;

    beforeEach(async () => {
        jest.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PrismaExceptionFilter,
                {
                    provide: LoggingService,
                    useValue: mockLoggerService
                },
            ]
        }).compile();
        service = module.get<PrismaExceptionFilter>(PrismaExceptionFilter);
    });

    describe('Prisma exception filter tests', () => {

        it('should be defined', () => {
            expect(service).toBeDefined();
        });

        describe('Catch method', () => {
            it(`should catch and log the exception with forbidden status in case of 
        unique constraing violation`, () => {
                service.catch(
                    new PrismaClientKnownRequestError('Prisma exception', UNIQUE_CONSTRAINT_FAILURE_CODE, ''),
                    mockArgumentsHost
                );
                expect(mockLoggerService.error).toHaveBeenCalled();
                expect(mockLoggerService.error).toHaveBeenCalledWith(CREDENTIALS_TAKEN_ERROR_MESSAGE);
                expect(mockHttpArgumentsHost).toBeCalledTimes(1);
                expect(mockHttpArgumentsHost).toBeCalledWith();
                expect(mockGetResponse).toBeCalledTimes(1);
                expect(mockGetResponse).toBeCalledWith();
                expect(mockStatus).toBeCalledTimes(1);
                expect(mockStatus).toBeCalledWith(HttpStatus.FORBIDDEN);
                expect(mockJson).toBeCalledTimes(1);
            });
        });
    });
});
