import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { WaitListModule } from './wait-list/wait-list.module';
import { ReportsModule } from './reports/reports.module';
import { ProfileModule } from './profile';
import { SubscriptionModule } from './subscription/subscription.module';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
    imports: [WaitListModule, ReportsModule, ProfileModule, SubscriptionModule, TransactionsModule],
    controllers: [ApiController],
})
export class ApiModule {
}
