import React, { useContext } from 'react';

import { FormatCurrency, FormatCurrencyPence, FormatPercent } from 'Utils/Strings';
import { GetReport } from 'Components/ReviewComponents/GetReport';
import { CalculatePlatformModel } from '../Model/FeeModel';
import { PlatformView, ProviderBlockView } from '../Model/FeeTypes';
import { Context } from 'State';
import { Policy } from 'Types/ClientResources';
import Table from 'Components/Library/Table/Table';
import { PolicyType } from 'Types/OrgResources';
import Panel from 'Components/Library/Panel/Panel';

const FeeTotals = () => {
    const [ state ]: any = useContext(Context);    

    let report = GetReport();

    let view = CalculatePlatformModel(report);

    return <>
        <FeeTotalsProviderSummary
            blocks         = {view.Providers}
            total          = {view.Total}
            weightedAvgFee = {view.WeightedFees * 100}
            totalCharges   = {view.TotalCharges}
        />

        {view.Providers.map((b: ProviderBlockView, ix: number) => (
            <ProviderBlock
                key    = {ix}
                block  = {b}
                total  = {view.Total}
                fee    = {state.Metadata.Fee}
            />
        ))}

        <SummaryTable
            view  = {view}
            total = {view.Total}
        />
    </>
}

const FeeTotalsProviderSummary = (props: {
    blocks: ProviderBlockView[],
    total: number,
    weightedAvgFee: number,
    totalCharges: number,
}) => (
    <Panel>
        <b>Platform Summary:</b>
        <ul>
            <li>
                Total invested: {FormatCurrency(props.total)}
            </li>
            <li>
                Total advice charges: {FormatCurrencyPence(props.totalCharges)}
            </li>
        </ul>
    </Panel>
)

const ProviderBlock = (props: {
    key: any,
    block: ProviderBlockView,
    total: number,
    fee: number,
}) => {
    let {
        PlatformFeePercent: platformFeePercent,
        ProviderTotal: total,
        Provider: provider,
        TotalPercent: totalPercent,
        TotalCharge: totalCharge
    } = props.block;

        let feeGBP = FormatCurrency(props.fee / 100 * total);

        return (
        <Panel>
            <h3>
                {provider.Name}
            </h3>

            <b>Summary:</b>
            <ul>
                <li>
                    Total on platform: {FormatCurrency(total)}
                    &nbsp;
                    ({(totalPercent).toPrecision(4)}%)
                </li>
                <li>
                    Advice (client fee): {props.fee}% ({feeGBP})
                </li>
                <li>
                    Estimated annual charges: {FormatCurrencyPence(totalCharge)} ({(platformFeePercent).toPrecision(2)}% of your holdings).
                </li>
            </ul>
        </Panel>
    );
};

const SummaryTable = (props: {
    total: number,
    view: PlatformView,
}) => {
    const [ state ]: any = useContext(Context);    

    let columns = props.view.Providers.map(prov => ({
        Header: prov.Provider.Name,
        columns: prov.Policies.map((pol: Policy) => ({
            accessor: pol.Id,
            Header: pol.ExternalId,
        })),
    }));
    columns.unshift({
        Header: 'Policy Provider',
        columns: [{
            accessor: 'header',
            Header: 'Policy',
        }],
    });

    let policyTypes:                    any = { header: 'Policy type' };
    let clientFees:                     any = { header: 'Advice fee' };
    let endValues:                      any = { header: 'End value' };
    let portfolioPercents:              any = { header: 'Percentage of overall portfolio' };
    let providerPercents:               any = { header: 'Percentage of amount on platform' };
    let platformFeePercents:            any = { header: 'Platform fee, for entire holdings on platform' };
    let platformFees:                   any = { header: 'Platform fee, attributed to policy' };
    let discountedPlatformFeePercents:  any = { header: 'Discounted Platform Fee (%)' };
    let discountedPlatformFees:         any = { header: 'Discounted Platform Fee (£)' };
    let annualCharges:                  any = { header: 'Estimated annual charges' };
    let policyFeePercents:              any = { header: 'Platform' };
    let fundLevelOcfs:                  any = { header: 'Fund Level, OCF' }
    let fundLevelExAntes:               any = { header: 'Fund Level, Ex-Ante' }
    let portfolioLevelOcfs:             any = { header: 'Portfolio Level, OCF' }
    let portfolioLevelExAntes:          any = { header: 'Portfolio Level, Ex-Ante' }
    let dims:                           any = { header: 'DIM' }
    let totalPercents:                  any = { header: 'Total (%)' }
    let totalCharges:                   any = { header: 'Total (£)' }

    let data = [
        policyTypes,
        endValues,
        clientFees,
        policyFeePercents,
        fundLevelOcfs,
        fundLevelExAntes,
        portfolioLevelOcfs,
        portfolioLevelExAntes,
        dims,
        totalPercents,
        totalCharges,
    ];

    let totalHoldings = props.total / 100;

    let report = GetReport();

    props.view.Providers.forEach(prov => {
        prov.Policies.forEach((pol: Policy) => {
            policyTypes[pol.Id]           = report.PolicyTypes.find((t: PolicyType) => t.Id === pol.PolicyTypeId).Name;
            endValues[pol.Id]             = FormatCurrencyPence(pol.EndValue);

            let clientFeePercent = state.Metadata.Fee;
            let clientFeeCharge = state.Metadata.Fee / 10000 * pol.EndValue;
            clientFees[pol.Id]            = `${FormatPercent(clientFeePercent)} (${FormatCurrencyPence(clientFeeCharge)})`;
            
            let portfolioPercent          = pol.EndValue / totalHoldings;
            let providerTotal             = prov.ProviderTotal / 100;
            let providerPercent           = pol.EndValue / providerTotal;
            let platformFee               = providerPercent * prov.PlatformFeePercent;
            let annualCharge              = platformFee * providerTotal / 100;
            let policyFeePercent          = annualCharge / pol.EndValue * 100;
            let annualChargesWithDiscount = pol.EndValue / 100 * policyFeePercent;  // policyFeeCharge

            portfolioPercents[pol.Id]              = FormatPercent(portfolioPercent);
            providerPercents[pol.Id]               = FormatPercent(providerPercent);
            platformFeePercents[pol.Id]            = FormatPercent(prov.PlatformFeePercent);
            platformFees[pol.Id]                   = FormatCurrencyPence(platformFee);
            discountedPlatformFeePercents[pol.Id]  = 0;
            discountedPlatformFees[pol.Id]         = 0;
            annualCharges[pol.Id]                  = FormatCurrencyPence(annualCharge); // + additional
            policyFeePercents[pol.Id]              = `${FormatPercent(policyFeePercent)} (${FormatCurrencyPence(annualChargesWithDiscount)})`;

            let fundLevelOcfPercent = FormatPercent(prov.FundLevelOcf);
            let fundLevelOcfCharge = prov.FundLevelOcf / 100 * pol.EndValue
            let fundLevelOcfChargeFmt = FormatCurrencyPence(fundLevelOcfCharge);

            let fundLevelExAntePercent = FormatPercent(prov.FundLevelExAnte);
            let fundLevelExAnteCharge = prov.FundLevelExAnte / 100 * pol.EndValue;
            let fundLevelExAnteChargeFmt = FormatCurrencyPence(fundLevelExAnteCharge);

            fundLevelOcfs[pol.Id] = `${fundLevelOcfPercent} (${fundLevelOcfChargeFmt})`;
            fundLevelExAntes[pol.Id] = `${fundLevelExAntePercent} (${fundLevelExAnteChargeFmt})`;


            let portfolioLevelOcfPercent = FormatPercent(prov.PortfolioLevelOcf);
            let portfolioLevelOcfCharge = prov.PortfolioLevelOcf / 100 * pol.EndValue;
            let portfolioLevelOcfChargeFmt = FormatCurrencyPence(portfolioLevelOcfCharge);

            let portfolioLevelExAntePercent = FormatPercent(prov.PortfolioLevelExAnte);
            let portfolioLevelExAnteCharge = prov.PortfolioLevelExAnte / 100 * pol.EndValue;
            let portfolioLevelExAnteChargeFmt = FormatCurrencyPence(portfolioLevelExAnteCharge);

            portfolioLevelOcfs[pol.Id] = `${portfolioLevelOcfPercent} (${portfolioLevelOcfChargeFmt})`;
            portfolioLevelExAntes[pol.Id] = `${portfolioLevelExAntePercent} (${portfolioLevelExAnteChargeFmt})`;

            let pf = prov.DimFees.PolicyFees.get(pol.Id);
            let dimPercent = pf ? pf.WeightedAvgDimFee : 0;  // not entirely sure when pf can be null but it has been seen
            let dimCharge = pf ? dimPercent / 100 * pol.EndValue : 0;
            dims[pol.Id] = `${FormatPercent(dimPercent)} (${FormatCurrencyPence(dimCharge)})`;

            totalPercents[pol.Id] = FormatPercent(
                clientFeePercent
                + policyFeePercent
                + prov.FundLevelOcf
                + prov.FundLevelExAnte
                + prov.PortfolioLevelOcf
                + prov.PortfolioLevelExAnte
                + dimPercent);

            totalCharges[pol.Id] = FormatCurrencyPence(
                clientFeeCharge
                + annualChargesWithDiscount
                + fundLevelOcfCharge
                + fundLevelExAnteCharge
                + portfolioLevelOcfCharge
                + portfolioLevelExAnteCharge
                + dimCharge);
        });
    });

    return (
        <Panel>
            <Table columns={columns} data={data} renderRowSubComponent={null} />
        </Panel>
    );
};

export default FeeTotals;
