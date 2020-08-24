import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { UsersModule } from '@api/users';

@Module({
    imports: [UsersModule],
    controllers: [ProfileController],
})
export class ProfileModule {
}
