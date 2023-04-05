import React, { useCallback } from 'react';
import DownloadIcon from '@mui/icons-material/Download';

import { CalculatePlatformModel } from 'Components/ReviewComponents/Fees/Model/FeeModel';
import { Download } from 'Components/Library/FileHandling/FileDownloader';
import { FormatCurrencyPence, FormatPercent } from 'Utils/Strings';
import { GetReport } from 'Components/ReviewComponents/GetReport';
import { ModuleTypeFundLevelFees } from 'State/ApiCommands/OrgResources/Reviews/ModuleTypes';
import { Policy, Report } from 'Types/ClientResources';
import { PolicyFundFees, FundFee, ProviderBlockView } from 'Components/ReviewComponents/Fees/Model/FeeTypes';
import { Row } from './PlatformFees/CalculatedCharges';
import Module from 'Components/Pages/Advisor/Reviews/Modules/Module';
import Panel from 'Components/Library/Panel/Panel';
import Table from 'Components/Library/Table/Table';

interface FundFeeRow {
    id?: string,
    Fund: string | JSX.Element,
    ChargeOcf: string | JSX.Element,
    ChargeExAnte: string | JSX.Element,
    Percentage?: string,
    Include: boolean,
    WeightedFee?: string,
}

const PolicyBlock = (props: {
    report: Report
    policy: Policy
    fees: PolicyFundFees
}) => {
    const downloadFile = useCallback((fileUid: string) => () => {
        Download(fileUid);
    }, []);

    const columns = [
        {
            accessor: 'Fund',
            Header: 'Fund name',
            width: 1,
        },
        {
            accessor: 'ChargeOcf',
            Header: 'OCF (%)',
            width: 1,
        },
        {
            accessor: 'ChargeExAnte',
            Header: 'Transactional fee (%)',
            width: 1,
        },
        {
            accessor: 'Percentage',
            Header: 'Percentage of policy',
            width: 1,
        }, {
            accessor: 'Include',
            Header: 'Include in total?',
            width: 1,
            Cell: ({ row }: { row: Row }) => (
                (row.original.id !== 'avg' && row.original.id !== 'charges') ? 
                    row.original.Include ? 'Y' : 'N'
                : ''
            ),
        }, {
        //     accessor: 'WeightedOcf',
        //     Header: 'Weighted OCF (%)',
        //     width: 1,
        // }, {
        //     accessor: 'WeightedExAnte',
        //     Header: 'Weighted Transactional (%)',
        //     width: 1,
        // }, {
            accessor: 'actions',
            Header: 'Factsheet',
            type: 'actions',
            width: .5,
            Cell: ({ row }: { row: Row }) => (
                <>
                    {row.original.FileUid &&
                        <button onClick={downloadFile(row.original.FileUid)} className='ong-openFileIcon'>
                            <DownloadIcon />
                        </button>
                    }
                </>
            ),
        },
    ];

    let rows: FundFeeRow[] = props.fees.FundFees.map((p: FundFee) => ({
        id: p.Id,
        ...p,
        Fund: p.Fund.Name,
        FileUid: p.Fund.File?.Uid,
        ChargeOcf: FormatPercent(p.ChargeOcf),
        ChargeExAnte: FormatPercent(p.ChargeExAnte),
        WeightedOcf: FormatPercent(p.WeightedOcf),
        WeightedExAnte: FormatPercent(p.WeightedExAnte),
        Percentage: FormatPercent(p.Percentage),
        Include: p.IncludeInFee,
    }));

    rows.push({
        id: 'avg',
        Fund: <i>Weighted average</i>,
        ChargeOcf:<i>{FormatPercent(props.fees.WeightedAvgOcf)}</i>,
        ChargeExAnte:<i>{FormatPercent(props.fees.WeightedAvgExAnte)}</i>,
        Include: false,
    });
    rows.push({
        id: 'charges',
        Fund: <b><i>Estimated charge</i></b>,
        ChargeOcf: <b><i>{FormatCurrencyPence(props.fees.ChargeOcf)}</i></b>,
        ChargeExAnte: <b><i>{FormatCurrencyPence(props.fees.ChargeExAnte)}</i></b>,
        Include: false,
    });

    return (
        <Panel>
             <h3>Policy: {props.policy.ExternalId}</h3>
             <p>
                 Value at end of period: {FormatCurrencyPence(props.policy.EndValue)}
             </p>
 
             <Table columns={columns} data={rows} renderRowSubComponent={null} />
 
             {/* <ProportionWarning data={rows} property='Percentage' /> */}
         </Panel>
     );
 }

 const ProviderBlock = (props: {
    block: ProviderBlockView,
    total: number,
    key: number,
}) => {
    let fees: Map<string, PolicyFundFees> = props.block.Fees.FundFees;
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
                    report = {report}
                    policy = {report.Policies.find((p: Policy) => p.Id === policy)}
                    fees   = {fees.get(policy)!} />
            ))}
        </Panel>
    );
};

const FundLevelFees = () => {
    let report = GetReport();

    let view = CalculatePlatformModel(report);

    return (
        <>
            <Module module={ModuleTypeFundLevelFees} client={null} />
            <br />

            {view.Providers.map((b: ProviderBlockView, ix: number) => (
                <ProviderBlock key={ix} block={b} total={view.Total} />
            ))}
        </>
    );
}

export default FundLevelFees;
