import { Injectable, HttpService, NotFoundException, forwardRef, Inject } from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm'
import { Repository } from 'typeorm';
import { Transaction, TransactionType, TransactionProcessor } from './transactions.entity';
import { UsersService, User } from '@api/users';
import { ISubcriptionPlan } from '@api/subscription';
import { ITransactionProcessor } from './processors/transactions..interface';
import { PaystackCallbackDto } from './processors/dto/paystackdto';
import { SubscriptionService } from '@api/subscription/subscription.service';
import { AppStatus } from '@core/helpers';

@Injectable()
export class TransactionsService {

    constructor(
        @InjectRepository(Transaction) private readonly repository: Repository<Transaction>,
        @Inject(forwardRef(() => SubscriptionService)) private subcriptionService: SubscriptionService,
        private  userService: UsersService,
    ){}


    async InitializePlanTransaction(
        user: User,
        type: TransactionType,
        processor: ITransactionProcessor,
        plan: ISubcriptionPlan){

        const processorData =  processor.intializeTransaction(user.email, plan);
        const patial = {
            userId: user.id,
            processor: TransactionProcessor.Paysatck,
            amount: plan.fee,
            type,
            processorData
        }


        const transaction = new Transaction(patial)

        return this.repository.save(transaction);
    }

    async verifyPaystackTransaction(query: PaystackCallbackDto, processor: ITransactionProcessor) {

        const transaction = await this.findOneWithProccessorData({ reference: query.reference });


        if (!transaction) {
            throw new NotFoundException('Transaction reference not found');
        }

        // Verify Paystack
        const paystackData = await processor.verifyTransactions(transaction);

        if (paystackData.status !== 'success') {
            throw AppStatus.PAYMENT_TRANSACTION_FAILED;
        }

        // Update Transaction
        transaction.verified = true;
        await this.repository.save(transaction);

      
    }

    private async findOneWithProccessorData(proccessorData: any) {
        return await this.repository
            .createQueryBuilder('entity')
            .where('entity.proccessorData @> :proccessorData', { proccessorData })
            .limit(1)
            .getOne();

    }
    
}
