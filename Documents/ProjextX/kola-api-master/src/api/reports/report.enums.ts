export enum ReportStatus {
    Pending = 'PENDING',
    Errored = 'ERRORED',
    Failed = 'FAILED',
    NotHit  = 'NO_HIT',
    NotFound  = 'NOT_FOUND',
    Generated = 'GENERATED',
    RequirePhoneChallenge = 'REQUIRE_PHONE_CHALLENGE',
}

export enum ReportType {
    Basic = 'BASIC',
    ClassicPremium= 'CLASSIC_PREMIUM',
}


export enum CRCFacilityType {
    Commercial = 'COMMERCIAL',
    Microfinance = 'MICROFINANCE',
    Mortgage = 'MORTGAGE'
}
