import {ForbiddenException, Injectable} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {AuthDto, LoginDto} from "./dto";
import * as argon from "argon2";
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";


@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService
    ) {}

    async signup(dto: AuthDto): Promise<{ access_token: string }> {
        //Generate Password Hash
        const hash = await argon.hash(dto.password);

        //Save new user in db
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    password: hash,
                    firstName: dto.firstName,
                    lastName: dto.lastName
                },
                select: {
                    id: true,
                    email: true
                }
            })

            //Return saved user
            return this.signToken(user.id, user.email);
    }

    async login(dto: LoginDto): Promise<{ access_token: string }> {
        //Find user by email
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            }
        })
        //If user doesn't exist throw exception
        if (!user)
            throw new ForbiddenException("Credentials incorrect");

        //Compare Passwords
        const pwdMatches = await argon.verify(user.password, dto.password);

        //If password doesn't match throw exception
        if (!pwdMatches)
            throw new ForbiddenException("Credentials incorrect");

        return this.signToken(user.id, user.email);
    }

    async signToken(userId: number, email: string): Promise<{ access_token: string }> {
        const payload = {
            sub: userId,
            email
        }
        const token = await this.jwt.signAsync(payload, {
            // expiresIn: '15m',
            secret: this.config.get('JWT_KEY')
        });

        return {access_token: token};
    }
}
