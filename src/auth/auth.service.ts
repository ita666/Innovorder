import { Injectable } from '@nestjs/common';
import {  User, Product } from '@prisma/client';
import {PrismaService} from "../prisma/prisma.service";


@Injectable()
export class AuthService {


    constructor(
        private prisma: PrismaService
    ) {
    }

    login() {
        return {msg: 'Logged In'};
    }

    signup() {
        return {msg: 'Signed up'};
    }
}
