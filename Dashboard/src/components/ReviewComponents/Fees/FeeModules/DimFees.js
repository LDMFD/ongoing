import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { ModuleTypeDimFee } from 'State/ApiCommands/Global/Reviews/ModuleTypes';
import ModuleWrapper from 'components/Pages/Clients/Reviews/Modules/ModuleWrapper';
import { GetReport } from 'components/ReviewComponents/GetReport';

const DimFees = () => {
    let report = GetReport();

    let operators = [];
    report.Portfolios.forEach(p => {
        let model = report.Models.find(m => m.Id === p.ModelId);
        let op = report.Operators.find(o => o.Id === model.OperatorId);
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
            <ModuleWrapper module={ModuleTypeDimFee} />

            <DataGrid autoHeight {...data} />
        </>
    );
}

export default DimFees;
