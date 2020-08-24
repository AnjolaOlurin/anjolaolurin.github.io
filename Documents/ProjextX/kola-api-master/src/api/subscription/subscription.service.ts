import { Injectable, HttpService, NotFoundException, forwardRef, Inject } from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm'
import { Subscription } from './subscription.entity';
import { UsersService } from '@api/users/users.service';
import { JobService } from '@core/services/job.service';
import { ConfigService } from '@core/services/config.service';
import { SubscriptionStatus, SubscriptionPlanTypes } from './subscription.constants';
import { User } from '@api/users';
import { subscriptionDto } from './dto/subscription.dto';
import { TransactionsService } from '@api/transactions';


@Injectable()
export class SubscriptionService {

    constructor(
        @InjectRepository( Subscription)private repository :Repository<Subscription>,
        @Inject(forwardRef(() => TransactionsService)) private readonly transactionsService: TransactionsService,
        private readonly http: HttpService,
        private readonly jobService: JobService,
        private readonly usersService: UsersService,

    ){}


    async findOneByUserId(userId: number, conditions = {}, failSilently = false){
        const subscription = this.repository.findOne( {userId,...conditions});
        if(!subscription && failSilently){
            throw new NotFoundException(`No Subscription found`);
        }

        return subscription;
    }

    async createSubscription(user:User, planType: SubscriptionPlanTypes){
        let subscription = await  this.repository.findOne({userId: user.id});

        if(!subscription){
            subscription = new Subscription({userId: user.id})
        }

        if(subscription.plan[planType].fee == 0){
            subscription.plan = planType;
            subscription.status = SubscriptionStatus.Active;
            subscription.expires = null;
            subscription = await this.repository.save(subscription);

            return null;
       }

       subscription = await this.repository.save(subscription);

    }
}
