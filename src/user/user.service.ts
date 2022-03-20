import {ForbiddenException, Injectable} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {ConfigService} from "@nestjs/config";
import {User} from "@prisma/client";
import {AuthService} from "../auth/auth.service";

@Injectable()
export class UserService {

    constructor(
        private prisma: PrismaService,
        private config: ConfigService,
        private authService: AuthService
    ) {}


    async findUser(id: number): Promise<User> {
        const user = await this.prisma.user.findUnique({
            where : {
                id: id
            }
        });

        if(!user)
            throw new ForbiddenException("User doesn't exist");

        delete user.password;
        return user;
    }


    async updateUser(id: number, data: User): Promise<User> {
        const user = await this.prisma.user.findUnique({
            where: {
                id: id
            }
        })

        if(!user)
            throw new ForbiddenException("User doesn't exist");

        let updatedUser = await this.prisma.user.update({
            where:{
                id: id
            },
            data: {
                password: data.password,
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName
            }
        });

        const updatedToken = await this.authService.signToken(updatedUser.id, updatedUser.email);
        updatedUser = {...updatedUser, ...updatedToken};

        return updatedUser;
    }
}
