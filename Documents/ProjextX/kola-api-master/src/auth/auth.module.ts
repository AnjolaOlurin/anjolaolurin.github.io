import { Module, HttpModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '@api/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@api/users';
import { ConfigService } from '@core/services';
import { CoreModule } from '@core/core.module';
import { JwtStrategy } from './jwt.strategy';
import { PaystackService } from './paystack.service';

@Module({
    imports: [
        UsersModule,
        HttpModule,
        TypeOrmModule.forFeature([User]),
        PassportModule.register({
            defaultStrategy: 'jwt',
        }),
        JwtModule.registerAsync({
            imports: [CoreModule],
            useFactory: (config: ConfigService) => ({
                secret: config.JWT_SECRET,
                signOptions: { expiresIn: '60d' },
            }),
            inject: [ConfigService]
          }),
        ],
    providers : [AuthService, JwtStrategy, PaystackService],
    controllers: [AuthController],
})
export class AuthModule {

}
