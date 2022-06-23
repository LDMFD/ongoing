import React, { useCallback } from 'react';
import {
    Button,
    Paper,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

import Module from 'Components/Pages/Advisor/Reviews/Modules/Module';
import { CurrencyFormatter } from 'Utils/Strings';
import { ModuleTypeFundLevelFees } from 'State/ApiCommands/Global/Reviews/ModuleTypes';
import { GetReport } from 'Components/ReviewComponents/GetReport';
import { Download } from 'Components/Library/FileHandling/FileDownloader';
import Table from 'Components/Library/Table/Table';

const PolicyFunds = ({ report, policy, policyFunds }) => {
    const downloadFile = useCallback(fileUid => () => {
        Download(fileUid);
    }, []);

    const columns = [
        {
            accessor: 'fund',
            Header: 'Fund name',
            width: 1,
        },
        {
            accessor: 'ocf',
            Header: 'OCF (% pa)',
            width: 1,
        },
        {
            accessor: 'exAnte',
            Header: 'ex-Ante (% pa)',
            width: 1,
        },
        {
            accessor: 'percentage',
            Header: 'Percentage of policy',
            width: 1,
        },
        // { accessor: 'wOcf',Header: 'weight ocf', width: 1, },
        // { accessor: 'wEx', Header: 'weight ex-ante', width: 1, },
        {
            accessor: 'actions',
            Header: 'Factsheet',
            type: 'actions',
            width: .5,
            Cell: ({ row }) => (
                <>
                    {row.original.fileUid &&
                        <button onClick={downloadFile(row.original.fileUid)} className='ong-openFileIcon'>
                            <DownloadIcon />
                        </button>
                    }
                </>
            ),
        },
    ];

    policyFunds = policyFunds.map(pf => {
        let fund = report.Funds.find(f => f.Id === pf.FundId);
        return {
            id:          pf.Id,
            fund:        fund.Name,
            ocf:         fund.OcfFee,
            exAnte:      fund.ExAnteFee,
            percentage:  `${pf.Proportion * 100}%`,
            wOcf:        fund.OcfFee * pf.Proportion,
            wEx:         fund.ExAnteFee * pf.Proportion,
            fileUid:     fund.File?.Uid,
        };
    });

    let ocfWeightedAvg    = policyFunds.map(p => p.wOcf).reduce((p, q) => p + q, 0);
    let exAnteweightedAvg = policyFunds.map(p => p.wEx).reduce((p, q) => p + q, 0);

    let ocfPounds    = ocfWeightedAvg    / 100 * policy.EndValue;
    let exAntePounds = exAnteweightedAvg / 100 * policy.EndValue;

    let provider = report.PolicyProviders.find(p => p.Id === policy.PolicyProviderId);

    return (
       <Paper elevation={2} style={{ padding: '1rem', marginBottom: '2rem' }}>
            <h3>{provider.Name} ({policy.ExternalId})</h3>

            <p>
                Value at end of period: {CurrencyFormatter.format(policy.EndValue)} <br />
            </p>

            <Table columns={columns} data={policyFunds} />

            <p>
                <b>Weighted OCF:</b> {ocfWeightedAvg.toPrecision(2)}%<br />
                <b>Weighted Ex Ante:</b> {exAnteweightedAvg.toPrecision(2)}%<br />
            </p>
      
            Estimated annual charges in pounds, based on values at end of period:
            <br /> <br />
            <b>OCF:</b> {CurrencyFormatter.format(ocfPounds)}<br />
            <b>Ex Ante:</b> {CurrencyFormatter.format(exAntePounds)}<br />

            {policy.File.Uid &&
                <p>
                    Factsheet: {policy.File.Filename}
                    <Button onClick={Download.bind(null, policy.File.Uid)}>Download</Button>
                </p>
            }
        </Paper>
    );
}

const FundLevelFees = () => {
    let report = GetReport();

    return (
        <div>
            <Module module={ModuleTypeFundLevelFees} />
            <br />

            {report.Policies.map(p => {
                let policyFunds = report.PolicyFunds.filter(pf => pf.PolicyId === p.Id);
                return policyFunds.length ? (
                    <Paper elevation={2} key={p.Id}>
                        <PolicyFunds report      = {report}
                                     policy      = {p}
                                     policyFunds = {policyFunds} />
                    </Paper>
                ) : null;
            })}
        </div>
    );
}

export default FundLevelFees;
