import React from 'react';
import { ModuleTypeDimFee } from 'State/ApiCommands/OrgResources/Reviews/ModuleTypes';
import Module from 'Components/Pages/Advisor/Reviews/Modules/Module';
import { GetReport } from 'Components/ReviewComponents/GetReport';
import Table from 'Components/Library/Table/Table';
import Panel from 'Components/Library/Panel/Panel';
import { PolicyDimFees, ProviderBlockView } from 'Components/ReviewComponents/Fees/Model/FeeTypes';
import { CalculatePlatformModel } from 'Components/ReviewComponents/Fees/Model/FeeModel';
import { FormatCurrencyPence, FormatPercent } from 'Utils/Strings';
import { Policy } from 'Types/ClientResources';

interface FeeTableRow {
    id: string,
    Name: string | JSX.Element,
    Fee: string | JSX.Element,
    Percentage?: string,
    WeightedFee?: string,
}

const PolicyBlock = (props: {
    policy: string,
    fees: PolicyDimFees,
}) => {
    const columns = [
        {
            accessor: 'Name',
            Header: 'Name',
            width: .5,
        }, {
            accessor: 'Fee',
            Header: 'Fee',
            width: .5,
        }, {
            accessor: 'Percentage',
            Header: 'Percentage of policy',
            width: .5,
        // }, {
        //     accessor: 'WeightedFee',
        //     Header: 'Weighted DIM Fee',
        //     width: 0.5,
        }
    ];

    let fees: FeeTableRow[];
    fees = props.fees.DimFees.map(f => ({
        id: f.Id,
        Name: f.Operator.Name,
        Fee: FormatPercent(f.Operator.Fee),
        Percentage: FormatPercent(f.Proportion * 100),
        WeightedFee: FormatPercent(f.WeightedFee),
    } as FeeTableRow)).sort((p,q) => (p.Percentage! > q.Percentage!) ? -1 : ((p.Percentage! < q.Percentage!) ? 1 : 0));

    fees.push({
        id: 'avg',
        Name: <i>Weighted average</i>,
        Fee: <i>{FormatPercent(props.fees.WeightedAvgDimFee)}</i>,
    } as FeeTableRow);

    fees.push({
        id: 'charge',
        Name: <b><i>Estimated charge</i></b>,
        Fee: <b><i>{FormatCurrencyPence(props.fees.Charge)}</i></b>,
    } as FeeTableRow);

    return (
        <Panel>
            <h4>
                Policy: {props.policy}
            </h4>
            
            <Table columns={columns} data={fees} renderRowSubComponent={null} />
        </Panel>
    )
};

const ProviderBlock = (props: {
    block: ProviderBlockView,
    total: number,
}) => {
    let fees: Map<string, PolicyDimFees> = props.block.Fees.DimFees;
    let report = GetReport();
    let ix = 0;
    return (
        <Panel>
            <h3>
                Platform: {props.block.Provider.Name}
            </h3>

            {[...Array.from(fees.keys())].map(policy => (
                <PolicyBlock
                    key    = {ix++}
                    policy = {report.Policies.find((p: Policy) => p.Id === policy).ExternalId}
                    fees   = {fees.get(policy)!} />
            ))}
        </Panel>
    );
};

const DimFees = () => {
    let report = GetReport();

    let view = CalculatePlatformModel(report);

    return (
        <div>
            <Module module={ModuleTypeDimFee} client={null} />
            <br />

            {view.Providers.map((b: ProviderBlockView, ix: number) => (
                <ProviderBlock key={ix} block={b} total={view.Total} />
            ))}
        </div>
    );
}

export default DimFees;
