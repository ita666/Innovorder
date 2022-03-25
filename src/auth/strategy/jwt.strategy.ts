import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import {PrismaService} from "../../prisma/prisma.service";
import {User} from "@prisma/client";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        private config: ConfigService,
        private prisma: PrismaService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get('JWT_KEY'),
        });
    }

    async validate(payload: {
        sub: number,
        email: string
    }) {

        const user: User = await this.prisma.user.findUnique({
            where:{
                id: payload.sub
            }
        })
        delete user.password;
        return user;
    }
}
