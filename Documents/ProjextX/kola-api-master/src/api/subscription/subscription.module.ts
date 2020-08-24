import { Module, HttpModule } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from './subscription.entity';
import { UsersModule } from '@api/users';
import { TransactionsModule, TransactionsService} from '@api/transactions';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription]), HttpModule, TransactionsModule, UsersModule],
  providers: [TransactionsService, SubscriptionService],
  exports : [SubscriptionService]
})
export class SubscriptionModule {}
