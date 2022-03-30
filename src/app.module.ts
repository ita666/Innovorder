import {Module} from '@nestjs/common';
import {AuthModule} from './endpoints/auth/auth.module';
import {UserModule} from './endpoints/user/user.module';
import {PrismaModule} from './core/prisma/prisma.module';
import {ConfigModule} from "@nestjs/config";
import {ProductModule} from './endpoints/product/product.module';
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
