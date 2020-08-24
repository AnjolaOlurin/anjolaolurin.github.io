import {ApiProperty} from '@nestjs/swagger';
import {isEnum} from 'class-validator';
import { SubscriptionPlanTypes}  from '../subscription.constants'


export class subscriptionDto{
    @ApiProperty({example: SubscriptionPlanTypes.KolaPlus})
    readonly plantype: SubscriptionPlanTypes
}