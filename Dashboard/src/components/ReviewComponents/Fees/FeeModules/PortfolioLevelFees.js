import React, { useCallback } from 'react';
import {
    Button,
    Paper,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

import { ModuleTypePortfolioLevelFees } from 'State/ApiCommands/Global/Reviews/ModuleTypes';
import { CurrencyFormatter } from 'Utils/Strings';
import Module from 'Components/Pages/Advisor/Reviews/Modules/Module';
import { GetReport } from 'Components/ReviewComponents/GetReport';
import { Download } from 'Components/Library/FileHandling/FileDownloader';
import Table from 'Components/Library/Table/Table';

const PolicyPortfolios = ({ report, policy, portfolios }) => {
    const downloadFile = useCallback(fileUid => () => {
        Download(fileUid);
    }, []);

    const columns = [
        {
            accessor: 'model',
            Header: 'Model',
            width: 1,
        }, {
            accessor: 'ocfFee',
            Header: 'OCF Fee (%)',
            width: 1,
        }, {
            accessor: 'exAnteFee',
            Header: 'Ex Ante Fee (%)',
            width: 1,
        }, {
            accessor: 'proportionStr',
            Header: 'Proportion' ,
            width: 1,
        // // {
        //     accessor: 'weightedOcfFee',
        //     headerName: 'Weighted OCF (%)',
        //     width: 1,
        // }, // {
        //     accessor: 'weightedExAnteFee',
        //     headerName: 'Weighted Ex Ante (%)',
        //     width: 1,
        }, {
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

    portfolios = portfolios.filter(p => p.policyId === policy.Id).map(p => ({
        ...p,
        model: p.model.Name,
        fileUid: p.model.File?.Uid,
    }));

    if (!portfolios.length) {
        return null;
    }

    let weightedOcf    = portfolios.map(p => p.ocf * p.proportion).reduce((p, q) => p + q, 0);
    let weightedExAnte = portfolios.map(p => p.exAnte * p.proportion).reduce((p, q) => p + q, 0);

    let ocfPounds    = weightedOcf    / 100 * policy.EndValue;
    let exAntePounds = weightedExAnte / 100 * policy.EndValue;

    let provider = report.PolicyProviders.find(p => p.Id === policy.PolicyProviderId);

    return (
       <Paper elevation={2} style={{ padding: '1rem', marginBottom: '2rem' }}>
            <h3>{provider.Name} ({policy.ExternalId})</h3>

            <p>
                Value at end of period: {CurrencyFormatter.format(policy.EndValue)} <br />
            </p>

            <Table columns={columns} data={portfolios} />

            <p>
                <b>Weighted OCF:</b> {weightedOcf.toPrecision(2)}%<br />
                <b>Weighted Ex Ante:</b> {weightedExAnte.toPrecision(2)}%<br />
            </p>
      
            {portfolios.length > 1 &&
                <>
                    Total of estimated annual charges in pounds, based on values at end of period:<br />
                    <b>OCF:</b> {CurrencyFormatter.format(ocfPounds)}<br />
                    <b>Ex Ante:</b> {CurrencyFormatter.format(exAntePounds)}<br />
                </>
            }

            {policy.File &&
                <p>
                    Factsheet: {policy.File.Filename}
                    <Button onClick={Download.bind(null, policy.File.Uid)}>Download</Button>
                </p>
            }
        </Paper>
    );
}

const PortfolioLevelFees = () => {
    let report = GetReport();

    let portfolios = report.Portfolios.map(portfolio => {
        let policy = report.Policies.find(p => p.Id === portfolio.PolicyId);
        let model = report.Models.find(m => m.Id === portfolio.ModelId);

        let ocfPercent    = (model.WeightedOcfFee).toPrecision(2);
        let exAntePercent = (model.WeightedExAnteFee).toPrecision(2);

        let ocfSterling    = model.WeightedOcfFee * policy.EndValue / 100;
        let exAnteSterling = model.WeightedExAnteFee * policy.EndValue / 100;

        let ocfStr    = `${ocfPercent}% (${CurrencyFormatter.format(ocfSterling)})`;
        let exAnteStr = `${exAntePercent}% (${CurrencyFormatter.format(exAnteSterling)})`;

        return {
            id:                portfolio.Id,
            proportion:        portfolio.Proportion,
            proportionStr:     `${portfolio.Proportion * 100}%`,
            policyId:          policy.Id,
            endValue:          `$${policy.EndValue}`,
            model:             model,
            ocfFee:            ocfStr,
            exAnteFee:         exAnteStr,
            ocf:               model.WeightedOcfFee,
            exAnte:            model.WeightedExAnteFee,
            weightedOcfFee:    (model.WeightedOcfFee * portfolio.Proportion).toPrecision(2),
            weightedExAnteFee: (model.WeightedExAnteFee * portfolio.Proportion).toPrecision(2),
        };
    });

    return (
        <>
            <Module module={ModuleTypePortfolioLevelFees} />
            <br />

            {report.Policies.map(p => 
                <PolicyPortfolios report={report}
                                  policy={p}
                                  portfolios={portfolios}
                                  key={p.Id} />
            )}
        </>
    );
}

export default PortfolioLevelFees;
