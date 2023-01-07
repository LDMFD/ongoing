import React, { useContext } from 'react';

import { FormatCurrency, FormatCurrencyPence, FormatPercent } from 'Utils/Strings';
import { GetReport } from 'Components/ReviewComponents/GetReport';
import { CalculatePlatformModel } from '../Model/FeeModel';
import { PlatformView, ProviderBlockView } from '../Model/FeeTypes';
import { Context } from 'State';
import { Policy } from 'Types/Client';
import Table from 'Components/Library/Table/Table';
import Panel from 'Components/Library/Panel/Panel';
import { PolicyType } from 'Types/OrgResources';

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
                {provider}
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
        Header: prov.Provider,
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
    let policyFeePercents:              any = { header: 'Platform fee, as a percentage of policy, ignoring discounts' };
    let annualChargesWithDiscounts:     any = { header: 'Estimated annual charges, with discounts' };


    let data = [
        policyTypes,
        clientFees,
        endValues,
        // portfolioPercents,
        // providerPercents,
        // platformFeePercents,
        // platformFees,
        // discountedPlatformFeePercents,
        // discountedPlatformFees,
        // annualCharges,
        policyFeePercents,
        annualChargesWithDiscounts,
    ];

    let totalHoldings = props.total / 100;

    let report = GetReport();

    props.view.Providers.forEach(prov => {
        prov.Policies.forEach((pol: Policy) => {
            policyTypes[pol.Id]           = report.PolicyTypes.find((t: PolicyType) => t.Id === pol.PolicyTypeId).Name;
            clientFees[pol.Id]            = `${state.Metadata.Fee}% (${FormatCurrencyPence(state.Metadata.Fee / 100 * pol.EndValue)})`;
            endValues[pol.Id]             = FormatCurrencyPence(pol.EndValue);
            
            let portfolioPercent          = pol.EndValue / totalHoldings;
            let providerTotal             = prov.ProviderTotal / 100;
            let providerPercent           = pol.EndValue / providerTotal;
            let platformFee               = providerPercent * prov.PlatformFeePercent;
            let annualCharge              = platformFee * providerTotal / 100;
            let policyFeePercent          = annualCharge / pol.EndValue * 100;
            let annualChargesWithDiscount = pol.EndValue / 100 * policyFeePercent;

            portfolioPercents[pol.Id]              = FormatPercent(portfolioPercent);
            providerPercents[pol.Id]               = FormatPercent(providerPercent);
            platformFeePercents[pol.Id]            = FormatPercent(prov.PlatformFeePercent);
            platformFees[pol.Id]                   = FormatCurrencyPence(platformFee);
            discountedPlatformFeePercents[pol.Id]  = 0;
            discountedPlatformFees[pol.Id]         = 0;
            annualCharges[pol.Id]                  = FormatCurrencyPence(annualCharge); // + additional
            policyFeePercents[pol.Id]              = FormatPercent(policyFeePercent);
            annualChargesWithDiscounts[pol.Id]     = FormatCurrencyPence(annualChargesWithDiscount);
        });
    });

    return (
        <Panel>
            <Table columns={columns} data={data} renderRowSubComponent={null} />
        </Panel>
    );
};

export default FeeTotals;
