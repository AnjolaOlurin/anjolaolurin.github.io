export interface CRCBasicCreditSummary {
    numOfFacilities: number,
    approvedAmount: number,
    outstandingBalance: number,
    amountOverdue: number,
    legalActionTaken: boolean
}

export interface ClassicFacilitySource {
    institution: string,
    faciliityCount: number,
    performingFacilities: number,
    nonPerformingFacilities: number,
    approvedAmount: number,
    accountBalance: number,
}


export interface CRCClassicPreminumSummary {
    totalFacilities: number,
    firstFacilityReportedDate: Date,
    negativeRemarks: string,
    paymentHistoryPerformance: number,
    paymentHistoryOverdues: number,
    totalOutstanding: number,
    performingFacilities: number,
    nonPerformingFacilities: number,
    paidOffFacilities: number,
    paidOffFacilitiesAmount: number,
    badFacilities: number,
    badFacilitiesAmount: number,
    sources: ClassicFacilitySource[]
}
