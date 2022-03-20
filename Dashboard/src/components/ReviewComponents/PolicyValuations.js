import React, { useContext } from 'react';
import { DataGrid } from '@mui/x-data-grid';

import { ModuleTypePolicyValuations } from 'State/ApiCommands/Global/Reviews/ModuleTypes';
import ModuleWrapper from 'components/Pages/Clients/Reviews/Modules/ModuleWrapper';
import { Context } from 'State';
import { CurrencyFormatter } from 'Utils/Strings';

const PolicyValuations = () => {
    const [state,  ] = useContext(Context);
    let client = state.ClientContext;

    const columns = [
        { field: 'policy',        headerName: 'Policy',        flex: 0.1, },
        { field: 'startValue',    headerName: 'Start value',   flex: 0.1, },
        { field: 'endValue',      headerName: 'End value',     flex: 0.1, },
        { field: 'contributions', headerName: 'Contributions', flex: 0.2, },
        { field: 'notes',         headerName: 'Notes',         flex: 0.2, },
    ];

    let valuations = client.Policies.map(p => {
        let contributions;
        switch (p.MonthlyContributions) {
            case null: 
                contributions = 'Data not provided';
                break;
            case 0:
                contributions = 'No regular contributions';
                break;
            default:
                contributions = 'Annual regular contributions';
                break;
        }

        return {
            id:            p.Id,
            policy:        p.ExternalId,
            startValue:    CurrencyFormatter.format(p.StartValue),
            endValue:      CurrencyFormatter.format(p.EndValue),
            contributions: `${contributions} (£${p.MonthlyContributions})`,
            notes:         p.Notes,
        };
    });

    let data = {
        rows: valuations,
        columns,
    }

    return (
        <>
            <ModuleWrapper client = {client}
                           module = {ModuleTypePolicyValuations} />
            <br />

            <DataGrid autoHeight {...data} />
        </>
    );
}

export default PolicyValuations;
