import { Module, HttpModule, forwardRef } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {SubscriptionModule} from '@api/subscription/subscription.module'
import { Transaction } from './transactions.entity';
import { UsersModule } from '@api/users';
import { SubscriptionService } from '@api/subscription/subscription.service';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction]), HttpModule, forwardRef(() => SubscriptionModule), UsersModule],
  providers: [TransactionsService],
  exports: [TransactionsService, TypeOrmModule.forFeature([Transaction])]
})
export class TransactionsModule {}
