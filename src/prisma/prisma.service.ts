import { Injectable } from '@nestjs/common';
import {PrismaClient} from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient {

    constructor() {
        super({
            datasources: {
                db: {
                    url: "mysql://user:password@localhost:3306/innovorder"
                }
            }
        })
    }
}
