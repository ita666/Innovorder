import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import {AuthService} from "../auth/auth.service";
import {PrismaService} from "../prisma/prisma.service";
import {User} from "@prisma/client";
import {ForbiddenException} from "@nestjs/common";
import {NON_EXISTING_USER_ERROR_MESSAGE} from "../exceptions/error-messages";
import {EditUserDto, UpdatedUserDto} from "./dto";

describe('UserService', () => {
  let service: UserService;

  const existingId = 15487465;
  const nonExistingId = 0;

  const mockJwt = {
    access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
  };

  const mockEditUserDto: EditUserDto = {
    email: "edit@mail.com",
    firstName: "editChuck",
    lastName: "editNorris",
    password: "edit123456"
  };

  const mockUpdatedUserDto: UpdatedUserDto = {
    id: 15487465,
    email: "edit@mail.com",
    firstName: "editChuck",
    lastName: "editNorris",
    token: mockJwt.access_token
  };

  const mockPrismaUser: User = {
    id: existingId,
    email: 'db@email.com',
    lastName: 'Norris',
    firstName: 'Chuck',
    password: '12345',
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }

  const getIdFromArgs = (id: any) => {
    return id.where.id;
  }

  const mockPrismaService = {
    user: {
      findUnique: jest.fn().mockImplementation((id) => {
        let response;
        getIdFromArgs(id) === existingId ? response = {...mockPrismaUser} : response = '';
        return Promise.resolve(response);
      }),
      update: jest.fn().mockImplementation((data) => {
        const editData = data.data;
        const user = {...mockPrismaUser};
        user.password = editData.password;
        user.email = editData.email;
        user.firstName = editData.firstName;
        user.lastName = editData.lastName;
        return Promise.resolve(user);
      })
    }
  };

  const mockAuthService = {
    signToken: jest.fn().mockImplementation(() => {
      return Promise.resolve(mockJwt);
    })
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService,
        {
          provide: PrismaService,
          useValue: mockPrismaService
        },
        {
          provide: AuthService,
          useValue: mockAuthService
        }],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findUser function', () => {
    it('should return a user promise if given correct id', async () => {
      const response = await service.findUser(existingId);

      const mockFunctionResponse = {...mockPrismaUser};
      delete mockFunctionResponse.password;

      expect(mockPrismaService.user.findUnique).toHaveBeenCalled();
      expect(response).toEqual(mockFunctionResponse);
    });

    it('should throw a ForbiddenException if the user does not exist', async () => {
      try {
        const response = await service.findUser(nonExistingId);
        expect(mockPrismaService.user.findUnique).toHaveBeenCalled();
        expect(response).toThrow(ForbiddenException);
      } catch (e) {
        expect(e).toEqual(new ForbiddenException(NON_EXISTING_USER_ERROR_MESSAGE));
      }
    });
  });

  describe('updateUser function', () => {
    it('should return an updated user dto if given the correct id and user data', async () => {
      const response = await service.updateUser(existingId, mockEditUserDto);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalled();
      expect(mockPrismaService.user.update).toHaveBeenCalled();
      expect(mockAuthService.signToken).toHaveBeenCalled();
      expect(response).toEqual(mockUpdatedUserDto);
    });

    it('should throw a ForbiddenException if the user does not exist', async () => {
      try {
        const response = await service.updateUser(nonExistingId, mockEditUserDto);
        expect(mockPrismaService.user.findUnique).toHaveBeenCalled();
        expect(response).toThrow(ForbiddenException);
      } catch (e) {
        expect(e).toEqual(new ForbiddenException(NON_EXISTING_USER_ERROR_MESSAGE));
      }
    });
  });
});
