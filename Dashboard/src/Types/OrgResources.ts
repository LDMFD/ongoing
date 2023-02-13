import { File } from './Types';

export interface OrgResources {
    Funds: Fund[],
    Models: Model[],
    Operators: Operator[],
    PolicyProviders: PolicyProvider[],
    PolicyTypes: PolicyType[],
    RiskLevels: RiskLevel[],
    RiskProviders: RiskProvider[],
}

export interface PolicyType {
    Id: string,
    Name: string,
}

export interface PolicyProvider {
    Id: string,
    Name: string,
    Pricing: string,
    CustomPricing: string,
}

export interface ProviderCharge {
    ProviderId: string,
    Boundary: number,
    MoneyCharge: number,  // Discounted Charge in 'Fees - Platform charges' tab

    Amount: number,  // amount held in this tier
    Charge: number,  // 'charge' column; rate (0-1)
    UpperBoundary: number,
}

export interface ProviderDiscount {
    Id: string,
	PolicyProviderId: string,
	Discount: number,
}

export interface Fund {
    Id: string,
	Name: string,
	OcfFee: number,
	ExAnteFee: number,
	Modified: string,
	File?: File,
}

export interface Operator {
    Id: string,
    Name: string,
    Type: string,
    Fee: number,
}

export interface Model {
    Id: string,
	Name: string,
	OperatorId: string,
	WeightedOcfFee: number,
	WeightedExAnteFee: number,
	Modified: string,
	File: File,
}

export interface RiskProvider {
    Id: string,
    Name: string,
}

export interface RiskLevel {
    Id: string,
    RiskProviderId: string,
	Level: number,
	Label: string,
	Desc: string,
}
