import React, { useContext } from 'react';
import { useParams,  } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { ModuleTypeAdviceFee } from 'State/ApiCommands/Global/Reviews/ModuleTypes';
import { ModuleEditor } from '../../../EditModule';

import { Context } from 'State'
import { CurrencyFormatter } from 'Utils/Strings';

const AdviceFees = () => {
    const [ state, ] = useContext(Context);

    let { clientId, reviewId } = useParams();
    clientId = parseInt(clientId);
    reviewId = parseInt(reviewId);

    clientId = parseInt(clientId);

    let client = state.Clients.find(c => c.Id === clientId);

    let policies = [];
    client.Policies.forEach(p => {
        if (!policies.some(pol => pol.Id === p.Id)) {
            policies.push({
                id:               p.Id,
                policyNumber:     p.ExternalId,
                fee:              CurrencyFormatter.format(client.Fee * p.EndValue),
            });
        }
    });

    const columns = [
        { field: 'policyNumber', headerName: 'Policy Number', flex: 0.1, },
        { field: 'fee',          headerName: 'Fee',           flex: 0.1, },
    ];

    let data = {
        rows: policies,
        columns: columns,
    }

    return (
        <>
            <br />
            <ModuleEditor clientId = {clientId}
                          reviewId = {reviewId}
                          module   = {ModuleTypeAdviceFee} />

            <p>
                Advice fee: {client.Fee * 100}%
            </p>

            <DataGrid autoHeight {...data} />
        </>
    );
}

export default AdviceFees;
