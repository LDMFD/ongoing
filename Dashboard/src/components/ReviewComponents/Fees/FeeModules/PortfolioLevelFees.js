import React from 'react';
import {
    Paper,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import { ModuleTypePortfolioLevelFees } from 'State/ApiCommands/Global/Reviews/ModuleTypes';
import { CurrencyFormatter } from 'Utils/Strings';
import ModuleWrapper from 'components/Pages/Clients/Reviews/Modules/ModuleWrapper';
import { GetReport } from 'components/ReviewComponents/GetReport';

const PolicyPortfolios = ({ policy, portfolios }) => {
    const columns = [
        { field: 'model',              headerName: 'Model',                flex: 0.1, },
        { field: 'ocfFee',             headerName: 'OCF Fee (%)',          flex: 0.1, },
        { field: 'exAnteFee',          headerName: 'Ex Ante Fee (%)',      flex: 0.1, },
        { field: 'proportion',         headerName: 'Proportion' ,          flex: 0.1, },
        // { field: 'weightedOcfFee',     headerName: 'Weighted OCF (%)', flex: 0.1, },
        // { field: 'weightedExAnteFee',  headerName: 'Weighted Ex Ante (%)', flex: 0.1, },
    ];

    portfolios = portfolios.filter(p => p.policyId === policy.Id);

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
            model:             model.Name,
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
