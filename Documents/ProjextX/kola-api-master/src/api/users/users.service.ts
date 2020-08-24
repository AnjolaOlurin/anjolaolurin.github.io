import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { DUPLICATE_UNIQUE_CONSTRAINT_CODE } from '@core/helpers';
import { EmailConflictException } from '@common/exceptions';
import { SCryptCryptoFactory } from '@core/crypto';

@Injectable()
export class UsersService {

    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) { }


    async create(userDetails: Partial<User>) {
        try {
            const entity = this.userRepository.create(userDetails);

            return await this.userRepository.save(entity);

        } catch (err) {
            if (err && err.code === DUPLICATE_UNIQUE_CONSTRAINT_CODE) {
                throw new EmailConflictException();
            }
            throw err;
        }
    }

    async findOneByPublicId(publicId: string, conditons = {}) {
        const user = await this.userRepository.findOne({publicId, ...conditons});
        if (!user) {
            throw new NotFoundException(`Account not found`);
        }
        return user;
    }

    async findOneById(userId: number, conditons = {}) {
        const user = await this.userRepository.findOne({id: userId, ...conditons});
        if (!user) {
            throw new NotFoundException(`Account not found`);
        }
        return user;
    }

    async findUserByEmail(email: string, conditons = {}) {
        const user = await this.userRepository.findOne({email, ...conditons});
        if (!user) {
            throw new NotFoundException(`Account not found`);
        }
        return user;
    }


    /**
     *
     * @param user
     * @param password
     * TODO: Add User  publiId  to revoked tokens
     */
    async changePassword(user: User, password: string) {
        user.passwordHash = await SCryptCryptoFactory.hash(password);

        return this.userRepository.save(user);
    }

}
