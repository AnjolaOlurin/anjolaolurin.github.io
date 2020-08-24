import { ISubcriptionPlan } from "@api/subscription";
import { Transaction} from "../transactions.entity";

export interface ITransactionProcessor{

    intializeTransaction(email: string, plan: ISubcriptionPlan): any
    verifyTransactions(transaction: Transaction);
}