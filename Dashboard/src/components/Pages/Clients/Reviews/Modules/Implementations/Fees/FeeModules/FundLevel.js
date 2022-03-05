import React, { useContext,  } from 'react';
import { useParams } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import {
    Paper,
} from '@mui/material';
import { ModuleEditor } from '../../../EditModule';

import { Context,  } from 'State'
import { CurrencyFormatter } from 'Utils/Strings';
import { ModuleTypeFundLevelFees } from 'State/ApiCommands/Global/Reviews/ModuleTypes';

const PolicyFunds = ({ policy }) => {
    const [state, ] = useContext(Context);

    let { clientId } = useParams();
    clientId = parseInt(clientId);

    let client = state.Clients.find(c => c.Id === clientId);

    const columns = [
        { field: 'fund',       headerName: 'Fund name',                flex: 0.1, },
        { field: 'ocf',        headerName: 'OCF (% pa)',               flex: 0.1, },
        { field: 'exAnte',     headerName: 'ex-Ante (% pa)',           flex: 0.1, },
        { field: 'percentage', headerName: 'Percentage of policy (%)', flex: 0.1, },
        // { field: 'wOcf',headerName: 'weight ocf', flex: 0.1, },
        // { field: 'wEx', headerName: 'weight ex-ante', flex: 0.1, },
    ];

    let policyFunds = client.PolicyFunds.filter(pf => pf.PolicyId === policy.Id).map(pf => {
        let fund = state.Funds.find(f => f.Id === pf.FundId);
        return {
            id:          pf.Id,
            fund:        fund.Name,
            ocf:         fund.OcfFee,
            exAnte:      fund.ExAnteFee,
            percentage:  pf.Proportion * 100,
            wOcf: fund.OcfFee * pf.Proportion,
            wEx:  fund.ExAnteFee * pf.Proportion,
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
       <Paper elevation={2}>
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
        </Paper>
    );
}

const FundLevelFees = () => {
    const [state,  ] = useContext(Context);

    let { clientId, reviewId } = useParams();
    clientId = parseInt(clientId);
    reviewId = parseInt(reviewId);

    let client = state.Clients.find(c => c.Id === clientId);

    return (
        <div>
            <ModuleEditor clientId = {clientId}
                          reviewId = {reviewId}
                          module   = {ModuleTypeFundLevelFees} />

            {client.Policies.map(p => (
                <Paper elevation={2} key={p.Id}>
                    <PolicyFunds policy={p} />
                </Paper>
            ))}
        </div>
    );
}

export default FundLevelFees;
