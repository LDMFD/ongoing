import * as ReactDOMServer from 'react-dom/server';
// import PropTypes from 'prop-types';

import { ModuleTypePolicyFees } from 'State/ApiCommands/OrgResources/Reviews/ModuleTypes';
import Module from 'Components/Pages/Advisor/Reviews/Modules/Module';
import { GetReport } from 'Components/ReviewComponents/GetReport';
import { FormatCurrencyPence, PercentageFormatter } from 'Utils/Strings';
import PoliciesTable from './PoliciesTable';
import { ProviderBlockView } from 'Components/ReviewComponents/Fees/Model/FeeTypes';
import CalculatedChargesTable from './CalculatedCharges';
import { CalculatePlatformModel } from 'Components/ReviewComponents/Fees/Model/FeeModel';
import Panel from 'Components/Library/Panel/Panel';

const Block = (props: {
    block: ProviderBlockView,
    total: number,
}) => {
    let {
        Charges: charges,
        CustomPricing: customPricing,
        PlatformCharge: platformCharge,
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
        <Panel>
            <h3>
                Platform: {provider.Name}
            </h3>

            <b>Summary:</b>
            <ul>
                <li>
                    You are holding a total of {FormatCurrencyPence(total)} on the {provider.Name} platform,
                    which is {PercentageFormatter.format(totalPercent)}% of your total holdings.
                </li>
                <li>
                    {provider.Name} charge an annual fee, which currently comes to {FormatCurrencyPence(platformCharge)},
                    or {PercentageFormatter.format(platformFeePercent)} of your holdings with them.
                </li>
                {/* <li>
                    (Weighted fee: {weightedFee})
                </li> */}
                {additionalFees ?
                    <li>
                        Additional {provider.Name} fees: £{additionalFees}
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
                           totalMoneyCharge = {platformCharge}
                           providerTotal    = {props.block.ProviderTotal} />
        </Panel>
    );
};

const PlatformFeesSummary = (props: {
    blocks: ProviderBlockView[],
    total: number,
    weightedAvgFee: number,
    totalCharges: number,
}) => (
    <Panel>
        <h3>Totals</h3>
        <ul>
            <li>
                Total invested: {FormatCurrencyPence(props.total)}
            </li>
            <li>
                Weighted average of platform fees: {(props.weightedAvgFee).toPrecision(2)}%
            </li>
            <li>
                Total platform charges: {FormatCurrencyPence(props.totalCharges)}
            </li>
        </ul>
    </Panel>
)

const PlatformFees = () => {
    let report = GetReport();

    let view = CalculatePlatformModel(report);

    return (
        <div>
            <Module client={null} module={ModuleTypePolicyFees} />

            <PlatformFeesSummary blocks         = {view.Providers}
                                 total          = {view.Total}
                                 weightedAvgFee = {view.WeightedFees * 100}
                                 totalCharges   = {view.TotalPlatformCharge} />

            {view.Providers.map((b: ProviderBlockView, ix: number) => (
                <Block key={ix} block={b} total={view.Total} />
            ))}
        </div>
    );
}

export default PlatformFees;
