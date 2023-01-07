import React, { useCallback } from 'react';
import {
    Button,
    Paper,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

import Module from 'Components/Pages/Advisor/Reviews/Modules/Module';
import { FormatCurrencyPence, FormatPercent } from 'Utils/Strings';
import { ModuleTypeFundLevelFees } from 'State/ApiCommands/OrgResources/Reviews/ModuleTypes';
import { GetReport } from 'Components/ReviewComponents/GetReport';
import { Download } from 'Components/Library/FileHandling/FileDownloader';
import Table from 'Components/Library/Table/Table';
import { ProportionWarning } from 'Components/Library/Warning/ProportionWarning';

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

    policyFunds = policyFunds.filter(pf => pf.IncludeInFee).map(pf => {
        let fund = report.Funds.find(f => f.Id === pf.FundId);
        return {
            id:          pf.Id,
            fund:        fund.Name,
            ocf:         FormatPercent(fund.OcfFee),
            exAnte:      FormatPercent(fund.ExAnteFee),
            proportion:  pf.Proportion,
            percentage:  FormatPercent(pf.Proportion * 100),
            wOcf:        fund.OcfFee * pf.Proportion,  // used for calculations only
            wEx:         fund.ExAnteFee * pf.Proportion,
            fileUid:     fund.File?.Uid,
        };
    }).sort((p,q) => (p.fund < q.fund) ? -1 : ((p.fund > q.fund) ? 1 : 0));

    let ocfWeightedAvg    = policyFunds.map(p => p.wOcf).reduce((p, q) => p + q, 0);
    let exAnteWeightedAvg = policyFunds.map(p => p.wEx).reduce((p, q) => p + q, 0);

    let ocfPounds    = ocfWeightedAvg    / 100 * policy.EndValue;
    let exAntePounds = exAnteWeightedAvg / 100 * policy.EndValue;

    policyFunds.push({
        id: 'avg',
        fund: <i>Weighted average</i>,
        ocf: <i>{FormatPercent(ocfWeightedAvg)}</i>,
        exAnte: <i>{FormatPercent(exAnteWeightedAvg)}</i>,
    });
    policyFunds.push({
        id: 'charges',
        fund: <i>Estimated charges</i>,
        ocf: <i>{FormatCurrencyPence(ocfPounds)}</i>,
        exAnte: <i>{FormatCurrencyPence(exAntePounds)}</i>,
    });

    let provider = report.PolicyProviders.find(p => p.Id === policy.PolicyProviderId);

    return (
       <Paper elevation={2} style={{ padding: '1rem', marginBottom: '2rem' }}>
            <h3>{provider.Name} ({policy.ExternalId})</h3>

            <p>
                Value at end of period: {FormatCurrencyPence(policy.EndValue)} <br />
            </p>

            <Table columns={columns} data={policyFunds} />

            <ProportionWarning data={policyFunds} property='proportion' />

            {policy.File &&
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
