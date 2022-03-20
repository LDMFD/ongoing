import React, { useContext  } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
    Paper,
} from '@mui/material';
import ModuleWrapper from 'components/Pages/Clients/Reviews/Modules/ModuleWrapper';
import { Context } from 'State';

import { CurrencyFormatter } from 'Utils/Strings';
import { ModuleTypeFundLevelFees } from 'State/ApiCommands/Global/Reviews/ModuleTypes';

const PolicyFunds = ({ client, policy }) => {
    const columns = [
        { field: 'fund',       headerName: 'Fund name',                flex: 0.1, },
        { field: 'ocf',        headerName: 'OCF (% pa)',               flex: 0.1, },
        { field: 'exAnte',     headerName: 'ex-Ante (% pa)',           flex: 0.1, },
        { field: 'percentage', headerName: 'Percentage of policy (%)', flex: 0.1, },
        // { field: 'wOcf',headerName: 'weight ocf', flex: 0.1, },
        // { field: 'wEx', headerName: 'weight ex-ante', flex: 0.1, },
    ];

    let policyFunds = client.PolicyFunds.filter(pf => pf.PolicyId === policy.Id).map(pf => {
        let fund = pf.Fund;
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
        </Paper>
    );
}

const FundLevelFees = () => {
    const [state,  ] = useContext(Context);
    let client = state.ClientContext;

    return (
        <div>
            <ModuleWrapper client={client} 
                           module={ModuleTypeFundLevelFees} />

            {client.Policies.map(p => (
                <Paper elevation={2} key={p.Id}>
                    <PolicyFunds client={client} policy={p} />
                </Paper>
            ))}
        </div>
    );
}

export default FundLevelFees;
