import { Policy, Report } from 'Types/ClientResources';
import { PlatformView, ProviderBlockView } from '../../Model/FeeTypes';
import { ImpactForm } from './Form';

export const Limits = {
    InvestmentGrowthRate: {
        min: -7,
        max: 21,
        step: 0.25,
        default: 7,
    },
    CashGrowthRate: {
        min: 0,
        max: 5,
        step: 0.1,
        default: 0.5,
    },
    Inflation: {
        min: 0,
        max: 15,
        step: 0.25,
        default: 2.5,
    },
};

// maxout will set all input options to true
const ImpactModel = (view: PlatformView, report: Report, input: ImpactForm, calcGridDomain: boolean) => {
    let inflation:     Map<string, number> = new Map();
    let advice:        Map<string, number> = new Map();
    let platformFees:  Map<string, number> = new Map();
    let fundFees:      Map<string, number> = new Map();
    let portfolioFees: Map<string, number> = new Map();
    let dimFees:       Map<string, number> = new Map();

    if (calcGridDomain) {
        input =  {
            InvestmentGrowthRate: Math.max(input.InvestmentGrowthRate, Limits.InvestmentGrowthRate.default),
            CashGrowthRate: input.CashGrowthRate,
            Inflation: input.Inflation,
            IncludeInflation: false,
            IncludeAdvice: false,
            IncludeFees: false,
        }
    }

    report.Policies.forEach((policy: Policy) => {
        inflation.set(policy.ExternalId, input.Inflation);
    });

    view.Providers.forEach((prov: ProviderBlockView) => {
        prov.Policies.forEach((pol: Policy) => {
            let charges = prov.PolicyTotals.get(pol.Id)!;
            advice.set(pol.ExternalId, charges.AdvicePercent);

            platformFees.set(pol.ExternalId, prov.PlatformFeePercent);

            let fundFee = prov.Fees.FundFees.get(pol.Id)!;
            fundFees.set(pol.ExternalId, (fundFee?.WeightedAvgOcf ?? 0) + (fundFee?.WeightedAvgExAnte ?? 0));

            let portfolioFee = prov.Fees.PortfolioFees.get(pol.Id)!;
            portfolioFees.set(pol.ExternalId, (portfolioFee?.WeightedAvgOcf ?? 0) + (portfolioFee?.WeightedAvgExAnte ?? 0));

            let dimFee = prov.Fees.DimFees.get(pol.Id)!;
            dimFees.set(pol.ExternalId, dimFee?.WeightedAvgDimFee);
        });
    });

    const data = [] as any;
    let row = {
        year: 1,
        cash: view.GrandTotals.TotalInvested,
        total: view.GrandTotals.TotalInvested,
    };
    report.Policies.forEach((policy: Policy) => {
        // @ts-ignore
        row[policy.ExternalId] = policy.EndValue;
    });
    data.push(row);

    for (let i = 2; i <= 20; i++) {
        let last = data[i - 2];
        let cash = last.cash * (1 + input.CashGrowthRate / 100)
                             * (input.IncludeInflation ? 1 - input.Inflation / 100 : 1);
        let row = {
            year: i,
            cash: cash,
            total: 0,
        };
        report.Policies.forEach((policy: Policy) => {
            // @ts-ignore
            row[policy.ExternalId] = last[policy.ExternalId]
                * (1 + input.InvestmentGrowthRate / 100)
                * (input.IncludeInflation ? 1 - inflation.get(policy.ExternalId)!     / 100 : 1)
                * (input.IncludeAdvice    ? 1 - advice.get(policy.ExternalId)!        / 100 : 1)
                * (input.IncludeFees      ? 1 - platformFees.get(policy.ExternalId)!  / 100 : 1)
                * (input.IncludeFees      ? 1 - fundFees.get(policy.ExternalId)!      / 100 : 1)
                * (input.IncludeFees      ? 1 - portfolioFees.get(policy.ExternalId)! / 100 : 1)
                * (input.IncludeFees      ? 1 - dimFees.get(policy.ExternalId)!       / 100 : 1);
        });
        report.Policies.forEach((policy: Policy) => {
            // @ts-ignore
            row.total += row[policy.ExternalId];
        });
        data.push(row);
    }
    for (let i = 0; i < data.length; i++) {
        data[i].cash = Math.round(data[i].cash / 100);
        data[i].total = Math.round(data[i].total / 100);
        report.Policies.forEach((policy: Policy) => {
            data[i][policy.ExternalId] = Math.round(data[i][policy.ExternalId] / 100);
        });
    }

    return data;
}

export default ImpactModel;