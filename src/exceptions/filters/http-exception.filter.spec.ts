import {
    Test,
    TestingModule
} from '@nestjs/testing';
import {
    HttpStatus,
    HttpException, ArgumentsHost
} from '@nestjs/common';
import {HttpExceptionFilter} from "./http-exception.filter";
import {LoggingService} from "../../utils/logging/logging.service";


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

describe('Http exception filter service', () => {
    let service: HttpExceptionFilter;

    beforeEach(async () => {
        jest.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                HttpExceptionFilter,
                {
                    provide: LoggingService,
                    useValue: mockLoggerService
                },
            ]
        }).compile();
        service = module.get<HttpExceptionFilter>(HttpExceptionFilter);
    });

    describe('Http exception filter', () => {

        it('should be defined', () => {
            expect(service).toBeDefined();
        });

        describe('Catch method', () => {
            it('should catch and log Http exception', () => {
                service.catch(
                    new HttpException('Http exception', HttpStatus.BAD_REQUEST),
                    mockArgumentsHost
                );
                expect(mockLoggerService.error).toHaveBeenCalled();
                expect(mockLoggerService.error).toHaveBeenCalledWith('Http exception');
                expect(mockHttpArgumentsHost).toBeCalledTimes(1);
                expect(mockHttpArgumentsHost).toBeCalledWith();
                expect(mockGetResponse).toBeCalledTimes(1);
                expect(mockGetResponse).toBeCalledWith();
                expect(mockStatus).toBeCalledTimes(1);
                expect(mockStatus).toBeCalledWith(HttpStatus.BAD_REQUEST);
                expect(mockJson).toBeCalledTimes(1);
            });
        });
    });
});
