import * as ReactDOMServer from 'react-dom/server';
// import PropTypes from 'prop-types';

import { ModuleTypePolicyFees } from 'State/ApiCommands/OrgResources/Reviews/ModuleTypes';
import Module from 'Components/Pages/Advisor/Reviews/Modules/Module';
import { GetReport } from 'Components/ReviewComponents/GetReport';
import { FormatCurrency, FormatCurrencyPence, PercentageFormatter } from 'Utils/Strings';
import PoliciesTable from './PoliciesTable';
import { ProviderBlockView } from 'Components/ReviewComponents/Fees/Model/FeeTypes';
import CalculatedChargesTable from './CalculatedCharges';
import { CalculatePlatformModel } from 'Components/ReviewComponents/Fees/Model/FeeModel';

const PlatformFees = () => {
    let report = GetReport();

    let view = CalculatePlatformModel(report);
    console.log(view)

    return (
        <div>
            <br />
            <Module client={null} module={ModuleTypePolicyFees} />

            <PlatformFeesSummary blocks         = {view.Providers}
                                 total          = {view.Total}
                                 weightedAvgFee = {view.WeightedFees * 100}
                                 totalCharges   = {view.TotalCharges} />

            {view.Providers.map((b: ProviderBlockView, ix: number) => (
                <Block key={ix} block={b} total={view.Total} />
            ))}
        </div>
    );
}

const PlatformFeesSummary = (props: {
    blocks: ProviderBlockView[],
    total: number,
    weightedAvgFee: number,
    totalCharges: number,
}) => (
    <div style={{ background: 'rgb(249 218 218 / 40%)', padding: '0.5rem 1rem 1rem', margin: '1rem 0', borderRadius: '10px' }}>
        <b>Platform Summary:</b>
        <ul>
            <li>
                Total invested: {FormatCurrencyPence(props.total)}
            </li>
            <li>
                Weighted average fee: {(props.weightedAvgFee).toPrecision(2)}%
            </li>
            <li>
                Total advice charges: {FormatCurrencyPence(props.totalCharges)}
            </li>
        </ul>
    </div>
)

const Block = (props: {
    block: ProviderBlockView,
    total: number,
}) => {
    let {
        Charges: charges,
        CustomPricing: customPricing,
        TotalCharge: totalCharge,
        ProviderTotal: total,
        Provider: provider,
        Policies: policies,
        PlatformFeePercent: platformFeePercent,
        TotalPercent: totalPercent,
        // WeightedFee: weightedFee,
        AdditionalFees: additionalFees } = props.block;

    let chargesMarkup = ReactDOMServer.renderToStaticMarkup(
        <CalculatedChargesTable charges={charges} />
    );

    let pricing = props.block.Discount
        ? customPricing.replace(/{(\s)*charge(\s)*}/, `${props.block.Discount.Discount}`)  // replace { charge } with platform discount rate.
        : props.block.Pricing.replace(/{(\s)*table(\s)*}/, chargesMarkup);  // replace { table } with provider charges table.

    return (
        <div style={{ background: 'rgb(249 218 218 / 40%)', padding: '0.5rem 1rem 1rem', margin: '1rem 0', borderRadius: '10px' }}>
            <h3>
                Platform: {provider}
            </h3>

            <b>Summary:</b>
            <ul>
                <li>
                    You are holding a total of {FormatCurrencyPence(total)} on the {provider} platform,
                    which is {PercentageFormatter.format(totalPercent)} of your total holdings.
                </li>
                <li>
                    {provider} charge an annual fee, which currently comes to {FormatCurrencyPence(totalCharge)},
                    or {PercentageFormatter.format(platformFeePercent)} of your holdings with them.
                </li>
                {/* <li>
                    (Weighted fee: {weightedFee})
                </li> */}
                {additionalFees ?
                    <li>
                        Additional {provider} fees: £{additionalFees}
                    </li>
                : null}
            </ul>

            {pricing && <>
                <p>
                    <b>Provider charges:</b>
                </p>
                <div className='ong-notes' dangerouslySetInnerHTML={{ __html: pricing }} />
            </>}

            <br />
            <b>Policies:</b>

            <p>
                The table below shows the portion of the total platform charge which arises from each policy held on the platform.
            </p>
            
            <PoliciesTable policies         = {policies}
                           totalMoneyCharge = {totalCharge}
                           providerTotal    = {props.block.ProviderTotal} />
        </div>
    );
};

export default PlatformFees;
