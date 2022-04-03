import React, { useContext  } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { ModuleTypeAdviceFee } from 'State/ApiCommands/Global/Reviews/ModuleTypes';

import { CurrencyFormatter } from 'Utils/Strings';
import ModuleWrapper from 'components/Pages/Clients/Reviews/Modules/ModuleWrapper';
import { Context } from 'State';
import { GetReport } from 'components/ReviewComponents/GetReport';

const AdviceFees = () => {
    const [state,  ] = useContext(Context);
    let client = state.ClientContext;

    let report = GetReport();
    
    let policies = [];
    report.Policies.forEach(p => {
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
            <ModuleWrapper module={ModuleTypeAdviceFee} />

            <p>
                Advice fee: {client.Fee * 100}%
            </p>

            <DataGrid autoHeight {...data} />
        </>
    );
}

export default AdviceFees;
