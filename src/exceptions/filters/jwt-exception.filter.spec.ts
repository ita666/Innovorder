import {Test, TestingModule} from '@nestjs/testing';
import {HttpStatus, ArgumentsHost} from '@nestjs/common';
import {JwtExceptionFilter} from "./jwt-exception.filter";
import {LoggingService} from "../../utils/logging/logging.service";
import {JsonWebTokenError} from "jsonwebtoken";


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
    let service: JwtExceptionFilter;

    beforeEach(async () => {
        jest.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                JwtExceptionFilter,
                {
                    provide: LoggingService,
                    useValue: mockLoggerService
                },
            ]
        }).compile();
        service = module.get<JwtExceptionFilter>(JwtExceptionFilter);
    });

    describe('Jwt exception filter', () => {

        it('should be defined', () => {
            expect(service).toBeDefined();
        });

        describe('Catch method', () => {
            it('should catch and log the exception with Unauthorized status', () => {
                service.catch(
                    new JsonWebTokenError('Jwt exception'),
                    mockArgumentsHost
                );
                expect(mockLoggerService.error).toHaveBeenCalled();
                expect(mockLoggerService.error).toHaveBeenCalledWith('Jwt exception');
                expect(mockHttpArgumentsHost).toBeCalledTimes(1);
                expect(mockHttpArgumentsHost).toBeCalledWith();
                expect(mockGetResponse).toBeCalledTimes(1);
                expect(mockGetResponse).toBeCalledWith();
                expect(mockStatus).toBeCalledTimes(1);
                expect(mockStatus).toBeCalledWith(HttpStatus.UNAUTHORIZED);
                expect(mockJson).toBeCalledTimes(1);
            });
        });
    });
});
