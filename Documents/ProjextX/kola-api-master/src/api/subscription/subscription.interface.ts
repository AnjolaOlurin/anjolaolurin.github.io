import { SubscriptionPlanTypes } from "./subscription.constants";

export interface ISubcriptionPlan {

    name: SubscriptionPlanTypes;
    fee: number
}
