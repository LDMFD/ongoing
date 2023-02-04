import { Operator, PolicyProvider, ProviderCharge, ProviderDiscount } from "Types/OrgResources";
import { Policy } from "Types/ClientResources";

export interface DimFee {
    Id?: string,
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
    DimFees: DimFees,
    Discount: ProviderDiscount,
    FundLevelExAnte: number,
    FundLevelOcf: number,
    PlatformFeePercent: number,
    Policies: Policy[],
    PortfolioLevelExAnte: number,
    PortfolioLevelOcf: number,
    Pricing: string,
    Provider: PolicyProvider,
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
