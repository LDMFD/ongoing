import { ProviderCharge, PolicyProvider, ProviderDiscount, Model, Fund } from 'Types/OrgResources';
import { Policy, PolicyFund, Report } from "Types/ClientResources";
import { PlatformView, PolicyDimFees, PolicyFundFees, PolicyPortfolioFees, ProviderBlockView, ChargeTable } from './FeeTypes';
import { State } from 'Types/Types';

interface ProviderBlock {
    CustomPricing: string,
    Discount: ProviderDiscount,
    Policies: Policy[],
    Pricing: string,
    Provider: PolicyProvider,
    ProviderTotal: number,  // Sum of end values of policies
}

export function CalculatePlatformModel(report: Report, state?: State): PlatformView {
    let blocks: ProviderBlock[] = [];

    let clientTotal = 0;  // Sum of end values of all policies across all providers

    // Group policies by provider, calculate provider total end value
    report.Policies.forEach((policy: Policy) => {
        let block: ProviderBlock = blocks.find(r => r.Provider.Id === policy.PolicyProviderId)!;
        if (block) {
            if (!block.Policies.some((p: Policy): boolean => p.Id === policy.Id)) {
                block.Policies.push(policy);
                block.ProviderTotal += policy.EndValue;
            }
        } else {
            // Assign these for convenience
            let provider = report.PolicyProviders.find((pp: PolicyProvider) => pp.Id === policy.PolicyProviderId)!;
            let discount = report.ProviderDiscounts.find((pd: ProviderDiscount) => pd.PolicyProviderId === policy.PolicyProviderId)!;

            blocks.push({
                Provider:             provider,
                Policies:             [ policy ],
                Discount:             discount,
                Pricing:              provider.Pricing,
                CustomPricing:        provider.CustomPricing,
                ProviderTotal:        policy.EndValue,
            })
        }
        clientTotal += policy.EndValue;
    });

    let WeightedFees = 0;
    let TotalPlatformCharge = 0;  // Sum of platform charges for all platforms

    let ix = 0;
    let providerBlocks: ProviderBlockView[] = blocks.map((block: ProviderBlock) => {
        let baseCharges = addBaseCharges(report, block, clientTotal);

        WeightedFees += baseCharges.WeightedFee;
        TotalPlatformCharge += baseCharges.PlatformCharge;

        let provider: ProviderBlockView = {
            Id: `${ix++}`,
            ...block,
            ...baseCharges,
            ...addPolicyLevel(report, block),
            ...addAdditionalFees(report, block),
            Fees: {
                ...addFundFees(report, block),
                ...addPortfolioFees(report, block),
                ...addDimFees(report, block),
            },
            ...addPolicyTotals(block, clientTotal, baseCharges.PlatformFeePercent, state)!,
            ...addStubTotals(),
        };
        return provider;
    });

    let res = {
        Providers: providerBlocks,
        Total: clientTotal,
        WeightedFees,
        TotalPlatformCharge,

        ...addProviderTotals(providerBlocks),
        ...addGrandTotals(providerBlocks),
    };

    res.GrandTotalCharge += res.TotalPlatformCharge;

    return res;
}

function addBaseCharges(report: Report, block: ProviderBlock, clientTotal: number) {
    let Charges = report.ProviderCharges
        .filter((pc: ProviderCharge) => pc.ProviderId === block.Provider.Id);

    Charges = calculatePlatformCharges(Charges, block.ProviderTotal);

    // 'Total Charge Percentage' from 'Fees - Platform charges' tab
    let PlatformCharge = Charges.map(p => p.MoneyCharge).reduce((p, q) => p + q, 0);
    
    // 'Fees - Platform (calcs)' tab, 'Platform fee, for entire holdings on platform'
    let PlatformFeePercent = PlatformCharge / block.ProviderTotal;
    
    let TotalPercent = block.ProviderTotal / clientTotal * 100;
    let WeightedFee = TotalPercent * PlatformFeePercent / 100;
    
    PlatformFeePercent *= 100;

    return { PlatformFeePercent, PlatformCharge, Charges, WeightedFee, TotalPercent };
}

function calculatePlatformCharges(charges: ProviderCharge[], value?: number): ProviderCharge[] {
    let res: ProviderCharge[] = [];
    if (charges.length === 0) {
        return [];
    }
    for (let i = 0; i < charges.length; ++i) {
        let upperBoundary;
        if (i === charges.length-1) {
            upperBoundary = Number.MAX_VALUE;
        } else {
            upperBoundary = charges[i + 1].Boundary - 1;
        }
        let amount = value === undefined ? 0
            : Math.max(0, value - charges[i].Boundary - Math.max(0, value - upperBoundary));
        res.push({
            ...charges[i],
            Amount: amount,
            MoneyCharge: charges[i].Charge / 100 * amount,
            UpperBoundary: upperBoundary,
        })
    }
    return res;
}

function addPolicyLevel(report: Report, block: ProviderBlock) {
    let PolicyFunds = report.PolicyFunds
        .filter(pf => pf.PolicyId === block.Policies[0].Id && pf.IncludeInFee);

    let FundLevelOcf = PolicyFunds.map(pf => {
        let fund = report.Funds.find(f => f.Id === pf.FundId)!;
        return fund.OcfFee * pf.Proportion;
    }).reduce((p, q) => p + q, 0);

    let FundLevelExAnte = PolicyFunds.map(pf => {
        let fund = report.Funds.find(f => f.Id === pf.FundId)!;
        return fund.ExAnteFee * pf.Proportion;
    }).reduce((p, q) => p + q, 0);

    return { PolicyFunds, FundLevelOcf, FundLevelExAnte };
}

function addFundFees(report: Report, block: ProviderBlock) {
    let FundFees = new Map<string, PolicyFundFees>();  // policy -> Fundfees
    
    report.PolicyFunds.forEach((policyFund: PolicyFund) => {
        let policy = report.Policies.find(p => p.Id === policyFund.PolicyId);
        if (policy?.PolicyProviderId !== block.Provider.Id) {
            return;
        }
        let fund: Fund = report.Funds.find(f => f.Id === policyFund.FundId)!;
        if (!FundFees.has(policy.Id)) {
            FundFees.set(policy.Id, new PolicyFundFees());
        }
        FundFees.get(policy.Id)!.FundFees.push({
            Fund: fund,
            Percentage: policyFund.Proportion * 100,
            ChargeOcf: fund.OcfFee,
            ChargeExAnte: fund.ExAnteFee,
            WeightedOcf: fund.OcfFee * policyFund.Proportion,
            WeightedExAnte: fund.ExAnteFee * policyFund.Proportion,
            IncludeInFee: policyFund.IncludeInFee,
        });
    });
    
    FundFees.forEach((pf: PolicyFundFees, key: string) => {
        pf.FundFees.forEach(p => {
            if (p.IncludeInFee) {
                pf.WeightedAvgOcf += p.WeightedOcf;
                pf.WeightedAvgExAnte += p.WeightedExAnte;
            }
        });
        let endValue = report.Policies.find(pol => pol.Id === key)!.EndValue;
        pf.ChargeOcf = pf.WeightedAvgOcf * endValue / 100;
        pf.ChargeExAnte = pf.WeightedAvgExAnte * endValue / 100;
    });

    return { FundFees };
}

function addPortfolioFees(report: Report, block: ProviderBlock) {
    let PortfolioFees = new Map<string, PolicyPortfolioFees>();  // policy -> portfoliofees
    
    report.Portfolios.forEach(portf => {
        let policy = report.Policies.find(p => p.Id === portf.PolicyId);
        if (policy?.PolicyProviderId !== block.Provider.Id) {
            return;
        }
        let model: Model = report.Models.find(m => m.Id === portf.ModelId)!;
        if (!PortfolioFees.has(policy.Id)) {
            PortfolioFees.set(policy.Id, new PolicyPortfolioFees());
        }
        PortfolioFees.get(policy.Id)!.PortfolioFees.push({
            Model: model,
            Percentage: portf.Proportion * 100,
            ChargeOcf: model.WeightedOcfFee,
            ChargeExAnte: model.WeightedExAnteFee,
            WeightedOcf: model.WeightedOcfFee * portf.Proportion,
            WeightedExAnte: model.WeightedExAnteFee * portf.Proportion,
            IncludeInFee: portf.IncludeInFee,
        });
    });
    
    PortfolioFees.forEach((pf: PolicyPortfolioFees, key: string) => {
        pf.PortfolioFees.forEach(p => {
            if (p.IncludeInFee) {
                pf.WeightedAvgOcf += p.WeightedOcf;
                pf.WeightedAvgExAnte += p.WeightedExAnte;
            }
        });
        let endValue = report.Policies.find(pol => pol.Id === key)!.EndValue;
        pf.ChargeOcf = pf.WeightedAvgOcf * endValue / 100;
        pf.ChargeExAnte = pf.WeightedAvgExAnte * endValue / 100;
    });

    return { PortfolioFees };
}

function addDimFees(report: Report, block: ProviderBlock) {
    let DimFees = new Map<string, PolicyDimFees>();    // policy -> models

    report.Portfolios.forEach(port => {
        let policy = report.Policies.find(pol => pol.Id === port.PolicyId)!;
        if (policy.PolicyProviderId !== block.Provider.Id) {
            return;
        }
        let pid = policy.Id;
        if (!DimFees.has(pid)) {
            DimFees.set(pid, {
                DimFees: [],
                WeightedAvgDimFee: 0,
                Charge: 0,
            });
        }
        let model = report.Models.find(m => m.Id === port.ModelId)!;
        let operator = report.Operators.find(o => o.Id === model.OperatorId)!;
        DimFees.get(pid)!.DimFees.push({
            Operator: operator,
            Proportion: port.Proportion,
            WeightedFee: operator.Fee * port.Proportion,
        });
    });
    
    DimFees.forEach((pdf: PolicyDimFees, key: string) => {
        pdf.DimFees.forEach(fee => {
          pdf.WeightedAvgDimFee += fee.WeightedFee;
        });
        pdf.Charge = pdf.WeightedAvgDimFee * report.Policies.find(pol => pol.Id === key)!.EndValue / 100;
    });
    
    return { DimFees };
}

function addAdditionalFees(report: Report, block: ProviderBlock) {
    return {
        AdditionalFees: 0,
    }
}

function addPolicyTotals(block: ProviderBlock, totalHoldings: number, platformFeePercent: number, state?: State) {
    if (!state) {
        return;
    }

    let PolicyTotals = new Map<string, ChargeTable>();

    block!.Policies.forEach((pol: Policy) => {
        let clientFeePercent = state.Metadata.Fee;
        let clientFeeCharge = state.Metadata.Fee / 100 * pol.EndValue;

        let charges = new ChargeTable();
        charges.AdviceCharge = clientFeeCharge;
        charges.AdvicePercent = clientFeePercent;

        let portfolioPercent          = pol.EndValue / totalHoldings!;
        let providerTotal             = block!.ProviderTotal;
        let providerPercent           = pol.EndValue / providerTotal;
        let platformFee               = providerPercent * platformFeePercent!;
        let annualCharge              = platformFee * providerTotal / 100;
        let policyFeePercent          = annualCharge / pol.EndValue * 100;
        let annualChargesWithDiscount = pol.EndValue / 100 * policyFeePercent;  // policyFeeCharge
        
        charges.PortfolioPercent = portfolioPercent;
        charges.ProviderTotal = providerTotal;
        charges.ProviderPercent = providerPercent;
        charges.PlatformFee = platformFee;
        charges.AnnualCharge = annualCharge;
        charges.PolicyFeePercent = policyFeePercent;
        charges.AnnualChargesWithDiscount = annualChargesWithDiscount;

        PolicyTotals.set(pol.Id, charges);
    });

    return { PolicyTotals };
}

let addStubTotals = () => ({
    ProviderTotals: new Map<string, ChargeTable>(),
    GrandTotals: new Map<string, ChargeTable>(),
});

function addProviderTotals(providers: ProviderBlockView[]) {
    let ProviderTotals = new Map<string, ChargeTable>();

    providers.forEach(provider => {
        let charges = new ChargeTable();

        provider.Policies.forEach(policy => {
            let policyCharges = provider.PolicyTotals?.get(policy.Id);
            if (!policyCharges) {
                return;
            }
            charges.TotalInvested += policy.EndValue;
            charges.AdviceCharge += policyCharges.AdviceCharge;
            charges.AnnualCharge += policyCharges.AnnualCharge;
            charges.FundLevelOcf += provider.Fees.FundFees.get(policy.Id)?.ChargeOcf ?? 0;
            charges.FundLevelExAnte += provider.Fees.FundFees.get(policy.Id)?.ChargeExAnte ?? 0;
            charges.PortfolioLevelOcf += provider.Fees.PortfolioFees.get(policy.Id)?.ChargeOcf ?? 0;
            charges.PortfolioLevelExAnte += provider.Fees.PortfolioFees.get(policy.Id)?.ChargeExAnte ?? 0;
            charges.DimCharges += provider.Fees.DimFees.get(policy.Id)?.Charge ?? 0;
        });

        charges.TotalPercent = (
            provider.PlatformFeePercent
            + charges.AdvicePercent
            + charges.FundLevelOcf
            + charges.FundLevelExAnte
            + charges.PortfolioLevelOcf
            + charges.PortfolioLevelExAnte
            + charges.DimCharges
        );
        charges.TotalCharge = (
            + charges.AnnualCharge
            + charges.AdviceCharge
            + charges.FundLevelOcf
            + charges.FundLevelExAnte
            + charges.PortfolioLevelOcf
            + charges.PortfolioLevelExAnte
            + charges.DimCharges
        );

        ProviderTotals.set(provider.Id!, charges);
    });

    return { ProviderTotals };
}

function addGrandTotals(providers: ProviderBlockView[]) {
    let GrandTotals = new ChargeTable();
    let GrandTotalCharge = 0;

    providers.forEach(provider => {
        provider.Policies.forEach(policy => {
            let policyCharges = provider.PolicyTotals?.get(policy.Id);
            if (!policyCharges) {
                return;
            }
            GrandTotals.TotalInvested += policy.EndValue;
            GrandTotals.AdviceCharge += policyCharges.AdviceCharge;
            GrandTotals.AnnualCharge += policyCharges.AnnualCharge;
            GrandTotals.FundLevelOcf += provider.Fees.FundFees.get(policy.Id)?.ChargeOcf ?? 0;
            GrandTotals.FundLevelExAnte += provider.Fees.FundFees.get(policy.Id)?.ChargeExAnte ?? 0;
            GrandTotals.PortfolioLevelOcf += provider.Fees.PortfolioFees.get(policy.Id)?.ChargeOcf ?? 0;
            GrandTotals.PortfolioLevelExAnte += provider.Fees.PortfolioFees.get(policy.Id)?.ChargeExAnte ?? 0;
            GrandTotals.DimCharges += provider.Fees.DimFees.get(policy.Id)?.Charge ?? 0;

            GrandTotalCharge += (
                + policyCharges.AdviceCharge
                + policyCharges.AnnualCharge
                + policyCharges.FundLevelOcf
                + policyCharges.FundLevelExAnte
                + policyCharges.PortfolioLevelOcf
                + policyCharges.PortfolioLevelExAnte
                + policyCharges.DimCharges
            );
        });
    });

    return { GrandTotals, GrandTotalCharge };
}
