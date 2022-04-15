import React, { useCallback } from 'react';
import {
    Button,
    Paper,
} from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import DownloadIcon from '@mui/icons-material/Download';

import { ModuleTypePortfolioLevelFees } from 'State/ApiCommands/Global/Reviews/ModuleTypes';
import { CurrencyFormatter } from 'Utils/Strings';
import ModuleWrapper from 'Components/Pages/Advisor/Reviews/Modules/ModuleWrapper';
import { GetReport } from 'Components/ReviewComponents/GetReport';
import { Download } from 'Components/Widgets/FileHandling/FileDownloader';

const PolicyPortfolios = ({ policy, portfolios }) => {
    const downloadFile = useCallback(params => () => {
        Download(params.row.fileUid);
    }, []);

    const columns = [
        { field: 'model',              headerName: 'Model',                flex: 0.1, },
        { field: 'ocfFee',             headerName: 'OCF Fee (%)',          flex: 0.1, },
        { field: 'exAnteFee',          headerName: 'Ex Ante Fee (%)',      flex: 0.1, },
        { field: 'proportion',         headerName: 'Proportion' ,          flex: 0.1, },
        // { field: 'weightedOcfFee',     headerName: 'Weighted OCF (%)', flex: 0.1, },
        // { field: 'weightedExAnteFee',  headerName: 'Weighted Ex Ante (%)', flex: 0.1, },
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

    portfolios = portfolios.filter(p => p.policyId === policy.Id).map(p => ({
        ...p,
        model: p.model.Name,
        fileUid: p.model.File?.Uid,
    }));

    if (!portfolios.length) {
        return null;
    }

    let data = {
        rows: portfolios,
        columns: columns,
    }

    let weightedOcf    = portfolios.map(p => p.ocf * p.proportion).reduce((p, q) => p + q, 0);
    let weightedExAnte = portfolios.map(p => p.exAnte * p.proportion).reduce((p, q) => p + q, 0);

    let ocfPounds    = weightedOcf    / 100 * policy.EndValue;
    let exAntePounds = weightedExAnte / 100 * policy.EndValue;

    return (
       <Paper elevation={2} style={{ padding: '1rem', marginBottom: '1rem' }}>
            <h3>{policy.ExternalId}</h3>

            <DataGrid autoHeight {...data} />

            <p>
                <b>Weighted OCF:</b> {weightedOcf}%<br />
                <b>Weighted Ex Ante:</b> {weightedExAnte}%<br />
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
            <ModuleWrapper module={ModuleTypePortfolioLevelFees} />

            {report.Policies.map(p => 
                <PolicyPortfolios policy={p} portfolios={portfolios} key={p.Id} />
            )}
        </>
    );
}

export default PortfolioLevelFees;
