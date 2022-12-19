import React, { useContext } from 'react';
import { useParams } from "react-router-dom";

import { CurrencyFormatter, CurrencyFormatterPence } from 'Utils/Strings';
import { GetReport } from 'Components/ReviewComponents/GetReport';
import { CalculatePlatformModel } from '../Model/FeeModel';
import { ProviderBlockView } from '../Model/FeeTypes';
import { Client } from 'Types/Types';
import { Context } from 'State';

const FeeTotals = () => {
    const [state]: any = useContext(Context);    

    let { clientId }: any = useParams();

    let client: Client = state.Clients.find((c: Client) => c.Id === clientId);

    let report = GetReport();

    let view = CalculatePlatformModel(report);

    return <>
        <FeeTotalsProviderSummary blocks         = {view.Providers}
                                  total          = {view.Total}
                                  weightedAvgFee = {view.WeightedFees * 100}
                                  totalCharges   = {view.TotalCharges} />

        {view.Providers.map((b: ProviderBlockView, ix: number) => (
            <ProviderBlock key    = {ix}
                           block  = {b}
                           total  = {view.Total}
                           client = {client} />
        ))}
    </>
}

const FeeTotalsProviderSummary = (params: {
    blocks: ProviderBlockView[],
    total: number,
    weightedAvgFee: number,
    totalCharges: number,
}) => (
    <div style={{ background: 'rgb(249 218 218 / 40%)', padding: '0.5rem 1rem 1rem', margin: '1rem 0', borderRadius: '10px' }}>
        <b>Platform Summary:</b>
        <ul>
            <li>
                Total invested: {CurrencyFormatter.format(params.total)}
            </li>
            <li>
                Total charges: {CurrencyFormatterPence.format(params.totalCharges)}
            </li>
        </ul>
    </div>
)

const ProviderBlock = (params: {
    block: ProviderBlockView,
    total: number,
    client: Client,
}) => {
    let {
        PlatformFeePercent: platformFeePercent,
        ProviderTotal: total,
        Provider: provider,
        TotalPercent: totalPercent,
        TotalCharge: totalCharge } = params.block;

        let feeGBP = CurrencyFormatter.format(params.client.Fee / 100 * total);

        return (
        <div style={{ background: 'rgb(249 218 218 / 40%)', padding: '0.5rem 1rem 1rem', margin: '1rem 0', borderRadius: '10px' }}>
            <h3>
                {provider}
            </h3>

            <b>Summary:</b>
            <ul>
                <li>
                    Total on platform: {CurrencyFormatter.format(total)}
                    &nbsp;
                    ({(totalPercent).toPrecision(4)}%)
                </li>
                <li>
                    Advice (client fee): {params.client.Fee}% ({feeGBP})
                </li>
                <li>
                    Estimated annual charges: {CurrencyFormatterPence.format(totalCharge)} ({(platformFeePercent).toPrecision(2)}% of your holdings).
                </li>
            </ul>
        </div>
    );
};

export default FeeTotals;
