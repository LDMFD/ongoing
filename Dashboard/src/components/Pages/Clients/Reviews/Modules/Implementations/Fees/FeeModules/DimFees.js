import React, { useContext } from 'react';
import { useParams,  } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { ModuleTypeDimFee } from 'State/ApiCommands/Global/Reviews/ModuleTypes';
import { ModuleEditor } from '../../../EditModule';

import { Context } from 'State'

const DimFees = () => {
    const [ state, ] = useContext(Context);

    let { clientId, reviewId } = useParams();
    clientId = parseInt(clientId);
    reviewId = parseInt(reviewId);

    clientId = parseInt(clientId);

    let client = state.Clients.find(c => c.Id === clientId);

    let operators = [];
    client.Portfolios.forEach(p => {
        let model = state.Models.find(m => m.Id === p.ModelId);
        let op = state.Operators.find(o => o.Id === model.OperatorId);
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
            <ModuleEditor clientId = {clientId}
                          reviewId = {reviewId}
                          module   = {ModuleTypeDimFee} />

            <DataGrid autoHeight {...data} />
        </>
    );
}

export default DimFees;
