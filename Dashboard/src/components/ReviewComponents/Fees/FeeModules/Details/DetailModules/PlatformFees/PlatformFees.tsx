import * as ReactDOMServer from 'react-dom/server';
// import PropTypes from 'prop-types';

import { ModuleTypePolicyFees } from 'State/ApiCommands/OrgResources/Reviews/ModuleTypes';
import Module from 'Components/Pages/Advisor/Reviews/Modules/Module';
import { GetReport } from 'Components/ReviewComponents/GetReport';
import { CurrencyFormatter, CurrencyFormatterPence } from 'Utils/Strings';
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

const PlatformFeesSummary = (params: {
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
                Weighted average fee: {(params.weightedAvgFee).toPrecision(2)}%
            </li>
            <li>
                Total charges: {CurrencyFormatterPence.format(params.totalCharges)}
            </li>
        </ul>
    </div>
)

const Block = (params: {
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
        AdditionalFees: additionalFees } = params.block;

    let chargesMarkup = ReactDOMServer.renderToStaticMarkup(
        <CalculatedChargesTable charges={charges} />
    );

    let pricing = params.block.Discount
        ? customPricing.replace('{{ charge }}', `${params.block.Discount.Discount}`)
        : params.block.Pricing.replace('{{ table }}', chargesMarkup);

return (
        <div style={{ background: 'rgb(249 218 218 / 40%)', padding: '0.5rem 1rem 1rem', margin: '1rem 0', borderRadius: '10px' }}>
            <h3>
                Platform: {provider}
            </h3>

            <b>Summary:</b>
            <ul>
                <li>
                    You are holding a total of {CurrencyFormatter.format(total)} on the {provider} platform,
                    which is {(totalPercent).toPrecision(4)}% of your total holdings.
                </li>
                <li>
                    {provider} charge an annual amount of {CurrencyFormatterPence.format(totalCharge)},
                    or {(platformFeePercent).toPrecision(2)}% of your holdings with them.
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
            
            <PoliciesTable policies         = {policies}
                           totalMoneyCharge = {totalCharge}
                           providerTotal    = {params.block.ProviderTotal} />
        </div>
    );
};

export default PlatformFees;
