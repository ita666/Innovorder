import {ExtractJwt, Strategy} from 'passport-jwt';
import {PassportStrategy} from '@nestjs/passport';
import {Injectable} from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import {PrismaService} from "../../../core/prisma/prisma.service";
import {User} from "@prisma/client";
import {NO_LONGER_EXISTING_JWT_USER_ERROR_MESSAGE} from "../../../core/exceptions/error-messages";
import {JsonWebTokenError} from "jsonwebtoken";


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
    }): Promise<User> {

        const user: User = await this.prisma.user.findUnique({
            where: {
                id: payload.sub
            }
        })

        if (!user)
            throw new JsonWebTokenError(NO_LONGER_EXISTING_JWT_USER_ERROR_MESSAGE);

        delete user.password;
        return user;
    }
}
