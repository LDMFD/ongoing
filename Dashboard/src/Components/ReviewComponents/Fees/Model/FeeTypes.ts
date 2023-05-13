import { Fund, Model, Operator, PolicyProvider, ProviderCharge, ProviderDiscount } from "Types/OrgResources";
import { Policy, PolicyFund } from "Types/ClientResources";

// Fund fees

export interface FundFee {
    Id?: string,
    Fund: Fund,
    Percentage: number,
    ChargeOcf: number,
    ChargeExAnte: number,
    WeightedOcf: number,
    WeightedExAnte: number,
    IncludeInFee: boolean,
}

export class PolicyFundFees {
    FundFees: FundFee[] = [];
    WeightedAvgOcf = 0;
    WeightedAvgExAnte = 0;
    ChargeOcf = 0;
    ChargeExAnte = 0;
}

// Portfolio fees

export interface PortfolioFee {
    Id?: string,
    Model: Model,
    Percentage: number,
    ChargeOcf: number,
    ChargeExAnte: number,
    WeightedOcf: number,
    WeightedExAnte: number,
    IncludeInFee: boolean,
}

export class PolicyPortfolioFees {
    PortfolioFees: PortfolioFee[] = [];
    WeightedAvgOcf = 0;
    WeightedAvgExAnte = 0;
    ChargeOcf = 0;
    ChargeExAnte = 0;
}

// DIM fees

export interface DimFee {
    Id?: string,
    Operator: Operator,
    Proportion: number,
    WeightedFee: number,
}

export interface PolicyDimFees {
    DimFees: DimFee[],
    WeightedAvgDimFee: number,
    Charge: number,
}

// Fees

export interface Fees {
    FundFees: Map<string, PolicyFundFees>,
    PortfolioFees: Map<string, PolicyPortfolioFees>,
    DimFees: Map<string, PolicyDimFees>,
}

//

export class ChargeTable {
    TotalInvested: number = 0;
    FundLevelOcf: number = 0;
    FundLevelExAnte: number = 0;
    PortfolioLevelOcf: number = 0;
    PortfolioLevelExAnte: number = 0;
    DimCharges: number = 0;
    AdviceCharge: number = 0;
    AdvicePercent: number = 0;
    TotalCharges: number = 0;

    PortfolioPercent: number = 0;
    ProviderTotal: number = 0;
    ProviderPercent: number = 0;
    PlatformFee: number = 0;
    AnnualCharge: number = 0;
    PolicyFeePercent: number = 0;
    AnnualChargesWithDiscount: number = 0;

    TotalPercent: number = 0;
    TotalCharge: number = 0;
}

// Provider/platform

export interface ProviderBlockView {
    Id?: string,
    AdditionalFees: number,
    Charges: ProviderCharge[],
    CustomPricing: string,
    Discount: ProviderDiscount,
    PlatformFeePercent: number,
    Policies: Policy[],
    PolicyFunds: PolicyFund[],
    Pricing: string,
    Provider: PolicyProvider,
    ProviderTotal: number,
    PlatformCharge: number,
    TotalPercent: number,
    WeightedFee: number,
    
    Fees: Fees,
    PolicyTotals: Map<string, ChargeTable>,
}

export interface PlatformView {
    Providers: ProviderBlockView[],
    Total: number,
    WeightedFees: number,
    
    TotalPlatformCharge: number,
    GrandTotalCharge: number,
    GrandTotals: ChargeTable,
    ProviderTotals: Map<string, ChargeTable>,
}
