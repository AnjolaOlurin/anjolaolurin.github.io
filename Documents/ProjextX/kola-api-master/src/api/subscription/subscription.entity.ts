import {Column, Entity, OneToOne, JoinColumn} from 'typeorm'
import { User } from '@api/users';
import {BaseEntity} from '@core/abstracts'
import { SubscriptionPlanTypes, SubscriptionStatus} from './subscription.constants';

@Entity()
export class Subscription extends BaseEntity<Subscription>{

    @Column()
    userId: number;

    @OneToOne(_ => User, {onDelete: "CASCADE"})
    @JoinColumn({name: 'userId'})
    user: User;

     // Subscription plan
     @Column('enum', { enum: SubscriptionPlanTypes })
     plan: SubscriptionPlanTypes;
 
     // Subscription status of the user
     @Column('enum', { enum: SubscriptionStatus, default: SubscriptionStatus.Inactive })
     status?: SubscriptionStatus;
 
     @Column({ type: 'timestamptz', nullable: true })
     expires?: Date;

}