import {Column, Entity, ManyToOne, JoinColumn} from 'typeorm';
import {BaseEntity} from '@core/abstracts';
import { User } from '@api/users';

export enum TransactionProcessor{
    Paysatck = 'PAYSTACK'
}

export enum TransactionType{
    Subcription = 'SUBSCRIPTION_PLAN'
}



@Entity()
export class Transaction extends BaseEntity<Transaction> {
    
    @Column()
    @ManyToOne(_ => User, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'userId'})
    userId: number;

    @Column()
    type: TransactionType;

    @Column()
    transactionProcessor: TransactionProcessor;

    @Column()
    typeId: number;

    @Column()
    amount: number

    @Column({type: "jsonb"})
    processorData: any

    @Column({default: false})
    verified: boolean
}