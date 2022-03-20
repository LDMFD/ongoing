import React, { useContext  } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { ModuleTypeDimFee } from 'State/ApiCommands/Global/Reviews/ModuleTypes';
import ModuleWrapper from 'components/Pages/Clients/Reviews/Modules/ModuleWrapper';
import { Context } from 'State';

const DimFees = () => {
    const [state,  ] = useContext(Context);
    let client = state.ClientContext;

    let operators = [];
    client.Portfolios.forEach(p => {
        let op = p.Model.Operator;
        if (op.Type === 'dim' && !operators.some(o => o.id === op.Id)) {
            operators.push({
                id:   op.Id,
                name: op.Name,
                fee:  op.Fee,
            });
        }
    });

    const columns = [
        { field: 'name', headerName: 'Name', flex: 0.1, },
        { field: 'fee',  headerName: 'Fee',  flex: 0.1, },
    ];

    let data = {
        rows: operators,
        columns: columns,
    }

    return (
        <>
            <br />
            <ModuleWrapper client={client}
                           module={ModuleTypeDimFee} />

            <DataGrid autoHeight {...data} />
        </>
    );
}

export default DimFees;
