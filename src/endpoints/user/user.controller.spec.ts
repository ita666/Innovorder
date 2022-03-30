import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import {User} from "@prisma/client";
import {EditUserDto, UpdatedUserDto} from "./dto";
import {JwtGuard} from "../auth/guard";
import {UserService} from "./user.service";
import {GetUser} from "./decorator";

describe('ServiceController', () => {
  let controller: UserController;

  const mockJwt: {access_token: string} = {
    access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
  };

  const mockPrismaUser: User = {
    id: 15487465,
    email: 'db@email.com',
    lastName: 'Norris',
    firstName: 'Chuck',
    password: '12345',
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }

  const mockUpdatedUserDto: UpdatedUserDto = {
    id: 15487465,
    email: 'db@emailmodified.com',
    lastName: 'Norrismodified',
    firstName: 'Chuckmodified',
    token: mockJwt.access_token
  }

  const mockEditUserDto: EditUserDto = {
    email: "edit@mail.com",
    firstName: "editChuck",
    lastName: "editNorris",
    password: "edit123456"
  };

  const mockUserService = {
    findUser: jest.fn().mockImplementation((id: number) => {
      return Promise.resolve(mockPrismaUser);
    }),
    updateUser: jest.fn().mockImplementation((id: number, user: User) => {
      return Promise.resolve(mockUpdatedUserDto);
    })
  }

  const mockJwtGuard = {

  }

  const mockGetUser = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService]
    })
        .overrideProvider(UserService)
        .useValue(mockUserService)
        .overrideGuard(JwtGuard)
        .useValue(mockJwtGuard)
        .overrideProvider(GetUser)
        .useValue(mockGetUser)
        .compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GetMe function ', () => {
    it('should retrieve prisma user object', () => {
      const response = controller.getMe(mockPrismaUser);
      expect(response.user).toEqual(mockPrismaUser);
    });
  });

  describe('GetUserById function ', () => {
    it('should retrieve user when seraching by id', async () => {
      const response = await controller.getUserById(mockPrismaUser.id);
      expect(mockUserService.findUser).toHaveBeenCalled();
      expect(response).toEqual(mockPrismaUser);
    });
  });

  describe('EditUser function ', () => {
    it('should retrieve an updated user DTO after editing a user', async () => {
      const response = await controller.editUser(mockPrismaUser.id, mockEditUserDto);
      expect(mockUserService.updateUser).toHaveBeenCalled();
      expect(response).toEqual(mockUpdatedUserDto);
    });
  });
});
