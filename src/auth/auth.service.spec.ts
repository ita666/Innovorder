import {Test, TestingModule} from '@nestjs/testing';
import {AuthService} from './auth.service';
import {AuthDto, LogInDto} from "./dto";
import Argon2, {hash, verify} from "argon2";
import {PrismaService} from "../prisma/prisma.service";
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {User} from "@prisma/client";
import {ForbiddenException} from "@nestjs/common";

describe('AuthService', () => {
    let service: AuthService;
    let prisma: PrismaService;

    const mockAuthDto: AuthDto = {
        email: "test@email.com",
        firstName: "test",
        password: "1234",
        lastName: "test"
    };

    const mockLoginDto: LogInDto = {
        email: 'test@email.com',
        password: '12345'
    }

    const mockPrismaUser: User = {
        id: 15487465,
        email: 'db@email.com',
        lastName: 'Norris',
        firstName: 'Chuck',
        password: '12345',
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now())

    }

    const mockJwt = {
        access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
    };

    const mockHashedPwd = "eervancomneormgvjaope54r4fr";

    const mockPrismaService = {
        user: {
            create: jest.fn().mockImplementation((data) => {
                return {
                    id: '145454e6f45e',
                    email: 'created@email.com'
                };
            }),
            findUnique: jest.fn().mockImplementation(
                (data) => {
                    return Promise.resolve(mockPrismaUser);
                })
        }
    };

    const mockJwtService = {
        signAsync: jest.fn().mockImplementation(() => {
            Promise.resolve(mockJwt.access_token);
        })
    };

    const mockConfig = {
        get: jest.fn().mockImplementation(jwtKey => {
            return 'secretKey';
        })
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AuthService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService
                },
                {
                    provide: JwtService,
                    useValue: mockJwtService
                },
                {
                    provide: ConfigService,
                    useValue: mockConfig
                }],
        }).compile();

        service = module.get<AuthService>(AuthService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    })

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should return a token after signing up', async () => {
        // Mock required methods
        jest
            .spyOn(Argon2, 'hash')
            .mockImplementation((pwd) => {
                return Promise.resolve(mockHashedPwd)
            });
        jest
            .spyOn(service, 'signToken')
            .mockImplementation((pwd) => {
                return Promise.resolve(mockJwt)
            });

        //Call tested method
        const result = await service.signUp(mockAuthDto);

        //Assess results
        expect(mockPrismaService.user.create).toHaveBeenCalled();
        expect(service.signToken).toHaveBeenCalled();
        expect(result).toEqual(mockJwt);

    });

    it('should return a token after logging in', async () => {
        jest
            .spyOn(Argon2, 'verify')
            .mockImplementation(data => {
                return Promise.resolve(true);
            });
        jest
            .spyOn(service, 'signToken')
            .mockImplementation((pwd) => {
                return Promise.resolve(mockJwt)
            });

        const result = await service.logIn(mockLoginDto);

        expect(service.signToken).toHaveBeenCalled();
        expect(result).toEqual(mockJwt);

    });

    it(`should throw a ForbiddenException if user does not exist when logging in`
        , async () => {
            jest
                .spyOn(prisma.user, 'findUnique')
                .mockImplementation((data) => {
                    return undefined;
                });

            try {
                const result = await service.logIn(mockLoginDto);
                expect(result).toThrow(ForbiddenException);
            } catch (e) {
                expect(e).toStrictEqual(new ForbiddenException("Credentials incorrect"));
            }
        });

    it(`should throw a ForbiddenException if password is wrong when logging in`,
        async () => {
            jest
                .spyOn(Argon2, 'verify')
                .mockImplementation(data => {
                    return Promise.resolve(false);
                });
            jest
                .spyOn(prisma.user, 'findUnique')
                // @ts-ignore
                .mockImplementation((data) => {
                    return Promise.resolve(mockPrismaUser);
                });

            try {
                const result = await service.logIn(mockLoginDto);
                expect(result).toThrow(ForbiddenException);
            } catch (e) {
                expect(e).toStrictEqual(new ForbiddenException("Credentials incorrect"));
            }
        });


    it('should return a token when providing an email and userId',
        async () => {
            jest
                .spyOn(mockJwtService, 'signAsync')
                // @ts-ignore
                .mockImplementation((data) => {
                    return Promise.resolve(mockJwt.access_token);
                });

            const result = await service.signToken(mockPrismaUser.id, mockPrismaUser.email);
            expect(mockJwtService.signAsync).toBeCalled();
            expect(result).toEqual(mockJwt);
        });
});
