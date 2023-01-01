import React, { useContext } from 'react';

import { CurrencyFormatter, CurrencyFormatterPence } from 'Utils/Strings';
import { GetReport } from 'Components/ReviewComponents/GetReport';
import { CalculatePlatformModel } from '../Model/FeeModel';
import { ProviderBlockView } from '../Model/FeeTypes';
import { Context } from 'State';

const FeeTotals = () => {
    const [state]: any = useContext(Context);    

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
                           fee    = {state.Metadata.Fee} />
        ))}
    </>
}

const FeeTotalsProviderSummary = (props: {
    blocks: ProviderBlockView[],
    total: number,
    weightedAvgFee: number,
    totalCharges: number,
}) => (
    <div style={{ background: 'rgb(249 218 218 / 40%)', padding: '0.5rem 1rem 1rem', margin: '1rem 0', borderRadius: '10px' }}>
        <b>Platform Summary:</b>
        <ul>
            <li>
                Total invested: {CurrencyFormatter.format(props.total)}
            </li>
            <li>
                Total charges: {CurrencyFormatterPence.format(props.totalCharges)}
            </li>
        </ul>
    </div>
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
        TotalCharge: totalCharge } = props.block;

        let feeGBP = CurrencyFormatter.format(props.fee / 100 * total);

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
                    Advice (client fee): {props.fee}% ({feeGBP})
                </li>
                <li>
                    Estimated annual charges: {CurrencyFormatterPence.format(totalCharge)} ({(platformFeePercent).toPrecision(2)}% of your holdings).
                </li>
            </ul>
        </div>
    );
};

export default FeeTotals;
