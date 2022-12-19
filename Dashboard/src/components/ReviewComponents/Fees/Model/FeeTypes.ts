import { Policy, ProviderCharge, ProviderDiscount } from "Types/Types";

export interface ProviderBlockView {
    Id?: string,
    AdditionalFees: number,
    Charges: ProviderCharge[],
    CustomPricing: string,
    Discount: ProviderDiscount,
    PlatformFeePercent: number,
    Policies: Policy[],
    Pricing: string,
    Provider: string,
    ProviderTotal: number,
    TotalCharge: number,
    TotalPercent: number,
    WeightedFee: number,
}

export interface PlatformView {
    Providers: ProviderBlockView[],
    Total: number,
    TotalCharges: number,
    WeightedFees: number,
}
