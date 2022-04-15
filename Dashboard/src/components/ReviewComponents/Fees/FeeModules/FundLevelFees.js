import React, { useCallback } from 'react';
import {
    Button,
    Paper,
} from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import DownloadIcon from '@mui/icons-material/Download';

import ModuleWrapper from 'Components/Pages/Advisor/Reviews/Modules/ModuleWrapper';
import { CurrencyFormatter } from 'Utils/Strings';
import { ModuleTypeFundLevelFees } from 'State/ApiCommands/Global/Reviews/ModuleTypes';
import { GetReport } from 'Components/ReviewComponents/GetReport';
import { Download } from 'Components/Widgets/FileHandling/FileDownloader';

const PolicyFunds = ({ review, policy, policyFunds }) => {
    const downloadFile = useCallback(params => () => {
        Download(params.row.fileUid);
    }, []);

    const columns = [
        { field: 'fund',       headerName: 'Fund name',                flex: 0.1, },
        { field: 'ocf',        headerName: 'OCF (% pa)',               flex: 0.1, },
        { field: 'exAnte',     headerName: 'ex-Ante (% pa)',           flex: 0.1, },
        { field: 'percentage', headerName: 'Percentage of policy (%)', flex: 0.1, },
        // { field: 'wOcf',headerName: 'weight ocf', flex: 0.1, },
        // { field: 'wEx', headerName: 'weight ex-ante', flex: 0.1, },
        {
            field: 'actions',
            headerName: 'Factsheet',
            type: 'actions',
            flex: .05,
            getActions: (params) => params.row.fileUid ? [
                <GridActionsCellItem icon={<DownloadIcon />}   onClick={downloadFile(params)} label="Download factsheet" />,
            ] : [],
        },
    ];

    policyFunds = policyFunds.map(pf => {
        let fund = review.Funds.find(f => f.Id === pf.FundId);
        return {
            id:          pf.Id,
            fund:        fund.Name,
            ocf:         fund.OcfFee,
            exAnte:      fund.ExAnteFee,
            percentage:  pf.Proportion * 100,
            wOcf:        fund.OcfFee * pf.Proportion,
            wEx:         fund.ExAnteFee * pf.Proportion,
            fileUid:     fund.File?.Uid,
        };
    });

    let data = {
        rows: policyFunds,
        columns,
    }

    let ocfWeightedAvg    = policyFunds.map(p => p.wOcf).reduce((p, q) => p + q, 0);
    let exAnteweightedAvg = policyFunds.map(p => p.wEx).reduce((p, q) => p + q, 0);

    let ocfPounds    = ocfWeightedAvg    / 100 * policy.EndValue;
    let exAntePounds = exAnteweightedAvg / 100 * policy.EndValue;

    return (
       <Paper elevation={2} style={{ padding: '1rem', marginBottom: '1rem' }}>
            <h3>{policy.ExternalId}</h3>

            <DataGrid autoHeight {...data} />

            <p>
                <b>Weighted OCF:</b> {ocfWeightedAvg.toPrecision(2)}%<br />
                <b>Weighted Ex Ante:</b> {exAnteweightedAvg.toPrecision(2)}%<br />
            </p>
      
            <p>
                Value at end of period: {CurrencyFormatter.format(policy.EndValue)} <br />
            </p>

            Estimated annual charges in pounds, based on values at end of period:<br />
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
            <ModuleWrapper module={ModuleTypeFundLevelFees} />

            {report.Policies.map(p => {
                let policyFunds = report.PolicyFunds.filter(pf => pf.PolicyId === p.Id);
                return policyFunds.length ? (
                    <Paper elevation={2} key={p.Id}>
                        <PolicyFunds review      = {report}
                                     policy      = {p}
                                     policyFunds = {policyFunds} />
                    </Paper>
                ) : null;
            })}
        </div>
    );
}

export default FundLevelFees;
