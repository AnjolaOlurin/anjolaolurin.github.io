import {ISubcriptionPlan} from './subscription.interface'

export enum SubscriptionPlanTypes {
    KolaPlus = 'KOLA_PLUS',
    KolaBasic = 'KOLA_BASIC'
}

export enum SubscriptionStatus{
    Active = 'ACTIVE',
    Inactive = 'INACTIVE'
}

export const SubscriptionPlan: {[props: string]: ISubcriptionPlan} = {
    KOLA_BASIC :  {
        name: SubscriptionPlanTypes.KolaBasic,
        fee: 0
    },
    KOLA_PLUS :  {
        name: SubscriptionPlanTypes.KolaPlus,
        fee: 500
    }
}