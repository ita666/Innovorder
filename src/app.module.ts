import {Module} from '@nestjs/common';
import {AuthModule} from './auth/auth.module';
import {UserModule} from './user/user.module';
import {PrismaModule} from './prisma/prisma.module';
import {ConfigModule} from "@nestjs/config";
import {ProductModule} from './product/product.module';
import {LoggingModule} from "./utils/logging/logging.module";

@Module({
    imports: [
        AuthModule,
        ConfigModule.forRoot({isGlobal: true}),
        UserModule,
        PrismaModule,
        ProductModule,
        LoggingModule
    ],
})
export class AppModule {
}
