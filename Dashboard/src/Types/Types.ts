export interface Org {
    Resources: OrgResources,
}

export interface OrgResources {
    PolicyTypes: PolicyType[],
    PolicyProviders: PolicyProvider[],
    Funds: Fund[],
}

export interface State {
    Resources: OrgResources,
    Report: Report,
}

export interface ClientIdentity {
    Email:     string,
	Forenames: string,
	Surname:   string,
}

export interface Client {
    Id:        string,
	UserId:    string,
	Identity:  ClientIdentity,
	Fee:       number,
	AdvisorId: string,
}

export interface File {
    Uid: string,
    Filename: string,
    Size: number,
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
    Charge: number,  // Discounted Charge in spreadsheet

    // Filled in if `value` passed to CalculatePlatformCharges
    Amount: number,
    MoneyCharge: number,
    UpperBoundary: number,
}

export interface ProviderDiscount {
    Id: string,
	PolicyProviderId: string,
	Discount: number,
}

export interface Fund {
    Id:        string,
	Name:      string,
	OcfFee:    number,
	ExAnteFee: number,
	Modified:  string,
	File?:     File,
}

export interface Policy {
    EndValue: number,
    ExternalId: string,
    File?: File,
    Id: string,
    MonthlyContributions: number,
    Notes: string,
    PolicyProviderId: string,
    PolicyTypeId: string,
    StartValue: number,
}

export interface PlatformFeesPolicy {
    ExternalId: string,
    EndValue: number,
    Proportion: number,
}

export interface Report {
    Policies: Policy[],
    PolicyProviders: PolicyProvider[],
    ProviderCharges: ProviderCharge[],
    ProviderDiscounts: ProviderDiscount[],
}
