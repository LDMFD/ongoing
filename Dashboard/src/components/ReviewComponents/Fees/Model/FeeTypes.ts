import { Operator, PolicyProvider, ProviderCharge, ProviderDiscount } from "Types/OrgResources";
import { Policy } from "Types/ClientResources";

export interface DimFee {
    Operator: Operator,
    Proportion: number,
    WeightedFee: number,
}

export interface PolicyDimFees {
    WeightedAvgDimFee: number,
    DimFees: DimFee[],
}

export interface DimFees {
    PolicyFees: Map<string, PolicyDimFees>,  // policy -> models + weighted avg
}

export interface ProviderBlockView {
    Id?: string,
    AdditionalFees: number,
    Charges: ProviderCharge[],
    CustomPricing: string,
    Discount: ProviderDiscount,
    PlatformFeePercent: number,
    Policies: Policy[],
    Pricing: string,
    Provider: PolicyProvider,
    ProviderTotal: number,
    TotalCharge: number,
    TotalPercent: number,
    WeightedFee: number,
    FundLevelOcf: number,
    FundLevelExAnte: number,
    PortfolioLevelOcf: number,
    PortfolioLevelExAnte: number,
    DimFees: DimFees,
}

export interface PlatformView {
    Providers: ProviderBlockView[],
    Total: number,
    TotalCharges: number,
    WeightedFees: number,
}
