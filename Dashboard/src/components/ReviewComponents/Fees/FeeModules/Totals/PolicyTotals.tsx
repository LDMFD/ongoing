import React from 'react';

import { FormatCurrencyPence, FormatCharge } from 'Utils/Strings';
import { GetReport } from 'Components/ReviewComponents/GetReport';
import { PlatformView, ProviderBlockView } from '../../Model/FeeTypes';
import { Policy, Report } from 'Types/ClientResources';
import Table from 'Components/Library/Table/Table';
import { PolicyType } from 'Types/OrgResources';
import Panel from 'Components/Library/Panel/Panel';
import { Row } from '../Details/DetailModules/PlatformFees/CalculatedCharges';

const PolicyTotals = (props: {
    report: Report,
    view: PlatformView,
}) => {
    let columns = props.report.Policies.map((pol: Policy) => {
        let provider = props.report.PolicyProviders.find(p => p.Id === pol.PolicyProviderId);
        return {
            accessor: pol.Id,
            Header: `${provider!.Name}: ${pol.ExternalId}`,
        };
    });
    columns.unshift({
        accessor: 'header',
        Header: '',
        // @ts-ignore as other rows don't have this property
        Cell: ({ row }: { row: Row }) => (
            row.original.header
        ),
    });

    let policyTypes:                    any = { header: 'Policy type' };
    let endValues:                      any = { header: 'End value' };
    let policyFeePercents:              any = { header: 'Platform' };
    let fundLevelOcfs:                  any = { header: 'Fund level, OCF' }
    let fundLevelExAntes:               any = { header: 'Fund level, Transactional' }
    let portfolioLevelOcfs:             any = { header: 'Portfolio level, OCF' }
    let portfolioLevelExAntes:          any = { header: 'Portfolio level, Transactional' }
    let dims:                           any = { header: 'DIM' }
    let clientFees:                     any = { header: 'Advice fees' };
    let totalCharges:                   any = { header: 'Total' }

    let data = [
        endValues,
        policyTypes,
        policyFeePercents,
        fundLevelOcfs,
        fundLevelExAntes,
        portfolioLevelOcfs,
        portfolioLevelExAntes,
        dims,
        clientFees,
        totalCharges,
    ];

    let report = GetReport();

    props.view.Providers.forEach((prov: ProviderBlockView) => {
        prov.Policies.forEach((pol: Policy) => {
            let charges = prov.PolicyTotals.get(pol.Id)!;

            let portfolioFee = prov.Fees.PortfolioFees.get(pol.Id)!;
            let fundFee      = prov.Fees.FundFees.get(pol.Id)!;
            let dimFee       = prov.Fees.DimFees.get(pol.Id)!;

            policyTypes[pol.Id]           = report.PolicyTypes.find((t: PolicyType) => t.Id === pol.PolicyTypeId).Name;
            endValues[pol.Id]             = FormatCurrencyPence(pol.EndValue);
            policyFeePercents[pol.Id]     = FormatCharge(prov.PlatformFeePercent, charges.AnnualCharge);
            fundLevelOcfs[pol.Id]         = FormatCharge(fundFee?.WeightedAvgOcf ?? 0, fundFee?.ChargeOcf);
            fundLevelExAntes[pol.Id]      = FormatCharge(fundFee?.WeightedAvgExAnte ?? 0, fundFee?.ChargeExAnte);
            portfolioLevelOcfs[pol.Id]    = FormatCharge(portfolioFee?.WeightedAvgOcf ?? 0, portfolioFee?.ChargeOcf);
            portfolioLevelExAntes[pol.Id] = FormatCharge(portfolioFee?.WeightedAvgExAnte, portfolioFee?.ChargeExAnte);
            dims[pol.Id]                  = FormatCharge(dimFee?.WeightedAvgDimFee, dimFee?.Charge);
            clientFees[pol.Id]            = FormatCharge(charges.AdvicePercent, charges.AdviceCharge);

            let percent = (
                + prov.PlatformFeePercent
                + charges.AdvicePercent
                + (fundFee?.WeightedAvgOcf ?? 0)
                + (fundFee?.WeightedAvgExAnte ?? 0)
                + (portfolioFee?.WeightedAvgOcf ?? 0)
                + (portfolioFee?.WeightedAvgExAnte ?? 0)
                + (dimFee?.WeightedAvgDimFee ?? 0)
            );

            let charge = (
                + charges.AnnualCharge
                + charges.AdviceCharge
                + (fundFee?.ChargeOcf ?? 0)
                + (fundFee?.ChargeExAnte ?? 0)
                + (portfolioFee?.ChargeOcf ?? 0)
                + (portfolioFee?.ChargeExAnte ?? 0)
                + (dimFee?.Charge ?? 0)
            )

            totalCharges[pol.Id] = <u>{FormatCharge(percent, charge)}</u>;
        });
    });

    return (
        <Panel>
            <h3>Policy Totals</h3>
            <Table columns={columns} data={data} renderRowSubComponent={null} />
        </Panel>
    );
};

export default PolicyTotals;
