import {Test, TestingModule} from '@nestjs/testing';
import {AuthController} from './auth.controller';
import {AuthService} from "./auth.service";
import {AuthDto, LogInDto} from "./dto";

describe('AuthController', () => {
    let controller: AuthController;
    let authService: AuthService;

    const mockAuthService = {
        signUp: jest.fn((dto) => {
            return mockJwt
        }),
        logIn: jest.fn((dto) => {
            return mockJwt
        })
    };

    const mockAuthDto: AuthDto = {
        email: 'test@email.com',
        password: '12345',
        firstName: 'Chuck',
        lastName: 'Norris'
    };

    const mockLoginDto: LogInDto = {
        email: 'test@email.com',
        password: '12345',
    };

    const mockJwt = {
        access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                AuthService,
                {
                    provide: AuthService,
                    useValue: mockAuthService
                }]
        })
            .overrideProvider(AuthService)
            .useValue(mockAuthService)
            .compile();

        controller = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('Should return a token after signUp', async () => {
        // jest.spyOn(authService, 'signUp').mockImplementation((dto: AuthDto) => {
        //     return Promise.resolve(mockJwt);
        // })
        const data = await controller.signUp(mockAuthDto);

        expect(mockAuthService.signUp).toHaveBeenCalled();
        expect(data).toEqual(mockJwt);
    });

    it('Should return after login', async () => {
        // jest.spyOn(authService, 'signUp').mockImplementation((dto: AuthDto) => {
        //     return Promise.resolve(mockJwt);
        // })
        const data = await controller.logIn(mockLoginDto);

        expect(mockAuthService.logIn).toHaveBeenCalled();
        expect(data).toEqual(mockJwt);
    });
});
