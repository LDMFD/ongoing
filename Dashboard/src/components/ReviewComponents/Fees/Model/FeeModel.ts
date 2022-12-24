import { ProviderCharge, PolicyProvider, ProviderDiscount } from 'Types/OrgResources';
import { Policy, Report } from "Types/Client";
import { PlatformView, ProviderBlockView } from './FeeTypes';

interface ProviderBlock {
    CustomPricing: string,
    Discount: ProviderDiscount,
    Policies: Policy[],
    Pricing: string,
    Provider: string,
    ProviderId: string,
    ProviderTotal: number,
}

export function CalculatePlatformModel(report: Report): PlatformView {
    let blocks: ProviderBlock[] = [];

    let total = 0;
    let weightedFees = 0;
    let totalCharges = 0;

    report.Policies.forEach((policy: Policy) => {
        let block: ProviderBlock = blocks.find(r => r.ProviderId === policy.PolicyProviderId)!;
        if (block) {
            if (!block.Policies.some((p: Policy): boolean => p.Id === policy.Id)) {
                block.Policies.push(policy);
                block.ProviderTotal += policy.EndValue;
            }
        } else {
            let provider = report.PolicyProviders.find((pp: PolicyProvider) => pp.Id === policy.PolicyProviderId)!;
            let discount = report.ProviderDiscounts.find((pd: ProviderDiscount) => pd.PolicyProviderId === policy.PolicyProviderId)!;
            blocks.push({
                ProviderId:       provider.Id,
                Provider:         provider.Name,
                Policies:         [ policy ],
                Discount:         discount,
                Pricing:          provider.Pricing,
                CustomPricing:    provider.CustomPricing,
                ProviderTotal:    policy.EndValue,
            })
        }
        total += policy.EndValue;
    });

    // Now we've got the total
    let ix = 0;
    let blockViews: ProviderBlockView[] = blocks.map(block => {
        let charges = report.ProviderCharges
            .filter((pc: ProviderCharge) => pc.ProviderId === block.ProviderId);

        charges = CalculatePlatformCharges(charges, block.ProviderTotal);

        let totalCharge = charges.map(p => p.MoneyCharge).reduce((p, q) => p + q, 0);

        let platformFeePercent = totalCharge / block.ProviderTotal * 100;
        let totalPercent = block.ProviderTotal / total * 100;
        let weightedFee = totalPercent * platformFeePercent / 10000;
        let additionalFees = 0;

        weightedFees += weightedFee;
        totalCharges += totalCharge;

        return {
            Id:                 `${ix++}`,
            AdditionalFees:     additionalFees,
            Charges:            charges,
            CustomPricing:      block.CustomPricing,
            Discount:           block.Discount,
            PlatformFeePercent: platformFeePercent,
            Policies:           block.Policies,
            Pricing:            block.Pricing,
            Provider:           block.Provider,
            ProviderTotal:      block.ProviderTotal,
            TotalCharge:        totalCharge,
            TotalPercent:       totalPercent,
            WeightedFee:        weightedFee,
        }
    });

    return {
        Providers: blockViews,
        Total: total,
        WeightedFees: weightedFees,
        TotalCharges: totalCharges,
    }
}

function CalculatePlatformCharges(charges: ProviderCharge[], value?: number): ProviderCharge[] {
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
