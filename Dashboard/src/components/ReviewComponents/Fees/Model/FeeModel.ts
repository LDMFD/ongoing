import { ProviderCharge, PolicyProvider, ProviderDiscount } from 'Types/OrgResources';
import { Policy, Report } from "Types/ClientResources";
import { PlatformView, PolicyDimFees, ProviderBlockView } from './FeeTypes';

interface ProviderBlock {
    CustomPricing: string,
    Discount: ProviderDiscount,
    Policies: Policy[],
    Pricing: string,
    Provider: PolicyProvider,
    ProviderTotal: number,
}

export function CalculatePlatformModel(report: Report): PlatformView {
    let blocks: ProviderBlock[] = [];

    let sumTotal = 0;

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
        sumTotal += policy.EndValue;
    });

    let WeightedFees = 0;
    let TotalCharges = 0;

    let ix = 0;
    let providerBlocks: ProviderBlockView[] = blocks.map(block => {
        let baseCharges = addBaseCharges(report, block, sumTotal);

        WeightedFees += baseCharges.WeightedFee;
        TotalCharges += baseCharges.TotalCharge;

        let fees = {
            Id: `${ix++}`,
            ...block,
            ...baseCharges,
            ...addPolicyLevel(report, block),
            ...addPortfolioLevel(report, block),
            ...addDimFees(report, block),
            ...addAdditionalFees(report, block),
        };
        // TODO Refactor - totals calculations should be moved here
        return fees;
    });

    return {
        Providers: providerBlocks,
        Total: sumTotal,
        WeightedFees,
        TotalCharges,
    }
}

function addBaseCharges(report: Report, block: ProviderBlock, total: number) {
    let Charges = report.ProviderCharges
        .filter((pc: ProviderCharge) => pc.ProviderId === block.Provider.Id);

    Charges = calculatePlatformCharges(Charges, block.ProviderTotal);

    let TotalCharge = Charges.map(p => p.MoneyCharge).reduce((p, q) => p + q, 0);

    let PlatformFeePercent = TotalCharge / block.ProviderTotal * 100;

    let TotalPercent = block.ProviderTotal / total * 100;
    let WeightedFee = TotalPercent * PlatformFeePercent / 10000;

    return { PlatformFeePercent, TotalCharge, Charges, WeightedFee, TotalPercent };
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

function addPortfolioLevel(report: Report, block: ProviderBlock) {
    let portfolios = report.Portfolios
        .filter(p => p.PolicyId === block.Policies[0].Id && p.IncludeInFee);

    let PortfolioLevelOcf = portfolios.map(p => {
        let model = report.Models.find(m => m.Id === p.ModelId)!;
        return model.WeightedOcfFee * p.Proportion;
    }).reduce((p, q) => p + q, 0);

    let PortfolioLevelExAnte = portfolios.map(p => {
        let model = report.Models.find(m => m.Id === p.ModelId)!;
        return model.WeightedExAnteFee * p.Proportion;
    }).reduce((p, q) => p + q, 0);

    return { PortfolioLevelOcf, PortfolioLevelExAnte };
}

function addDimFees(report: Report, block: ProviderBlock) {
    let PolicyFees = new Map<string, PolicyDimFees>();    // policy -> models

    report.Portfolios.forEach(port => {
        let policy = report.Policies.find(pol => pol.Id === port.PolicyId)!;
        if (policy.PolicyProviderId !== block.Provider.Id) {
            return;
        }
        let pid = policy.Id;
        if (!PolicyFees.has(pid)) {
            PolicyFees.set(pid, {
                DimFees: [],
                WeightedAvgDimFee: 0,
            });
        }
        let model = report.Models.find(m => m.Id === port.ModelId)!;
        let operator = report.Operators.find(o => o.Id === model.OperatorId)!;
        PolicyFees.get(pid)!.DimFees.push({
            Operator: operator,
            Proportion: port.Proportion,
            WeightedFee: operator.Fee * port.Proportion,
        });
    });
    
    PolicyFees.forEach((pdf: PolicyDimFees, key: string) => {
        pdf.DimFees.forEach(fee => {
          pdf.WeightedAvgDimFee += fee.WeightedFee;
        });
    });
    
    let DimFees = {
        PolicyFees,
    }

    return { DimFees };
}

function addAdditionalFees(report: Report, block: ProviderBlock) {
    return {
        AdditionalFees: 0,
    }
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
