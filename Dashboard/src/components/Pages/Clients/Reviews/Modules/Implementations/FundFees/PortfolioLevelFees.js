import {
    Button,
    Paper,
    Toolbar
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { useContext } from 'react';
import { Link, useParams } from 'react-router-dom';

import { Context } from 'State';

var formatter = new Intl.NumberFormat('en-UK', {
    style: 'currency',
    currency: 'GBP',
  
    minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

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
       <Paper elevation={2}>
            <h3>{policy.ExternalId}</h3>

            <DataGrid autoHeight {...data} />

            <p>
                <b>Weighted OCF:</b> {weightedOcf}%<br />
                <b>Weighted Ex Ante:</b> {weightedExAnte}%<br />
            </p>
      
            <p>
                Value at end of period: {formatter.format(policy.EndValue)} <br />
            </p>

            Estimated annual charges in pounds, based on values at end of period:<br />
            <b>OCF:</b> {formatter.format(ocfPounds)}<br />
            <b>Ex Ante:</b> {formatter.format(exAntePounds)}<br />
        </Paper>
    );
}

const PortfolioLevelFees = () => {
    const [state, ] = useContext(Context);

    let { clientId } = useParams();
    clientId = parseInt(clientId);

    let client = state.Clients.find(c => c.Id === clientId);

    let portfolios = client.Portfolios.map(portfolio => {
        let policy = client.Policies.find(p => p.Id === portfolio.PolicyId);
        let model = state.Models.find(p => p.Id === portfolio.ModelId);
        return {
            id:                portfolio.Id,
            proportion:        portfolio.Proportion,
            policyId:          policy.Id,
            endValue:          `$${policy.EndValue}`,
            model:             model.Name,
            ocfFee:            `${(model.WeightedOcfFee).toPrecision(2)}% (${formatter.format(model.WeightedOcfFee * policy.EndValue / 100)})`,
            exAnteFee:         `${(model.WeightedExAnteFee).toPrecision(2)}% (${formatter.format(model.WeightedExAnteFee * policy.EndValue / 100)})`,
            ocf:               model.WeightedOcfFee,
            exAnte:            model.WeightedExAnteFee,
            weightedOcfFee:    (model.WeightedOcfFee * portfolio.Proportion).toPrecision(2),
            weightedExAnteFee: (model.WeightedExAnteFee * portfolio.Proportion).toPrecision(2),
        };
    });

    return (
        <div className='ongoing-portfolioList'>
            <Toolbar className="breadcrumb-action">
                <Link to={{ pathname: `/clients/id/${client.Id}/portfolios/add` }}><Button>Add portfolio</Button></Link>
            </Toolbar>

            {client.Policies.map(p => 
                <PolicyPortfolios policy={p} portfolios={portfolios} key={p.Id} />
            )}
        </div>
    );
}

export default PortfolioLevelFees;
