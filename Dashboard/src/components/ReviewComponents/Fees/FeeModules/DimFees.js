import React from 'react';
import { ModuleTypeDimFee } from 'State/ApiCommands/Global/Reviews/ModuleTypes';
import ModuleWrapper from 'Components/Pages/Advisor/Reviews/Modules/ModuleWrapper';
import { GetReport } from 'Components/ReviewComponents/GetReport';
import Table from 'Components/Library/Table';

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
                fee:  `${(op.Fee * 100).toPrecision(2)}%`,
            });
        }
    });

    const columns = [
        {
            accessor: 'name',
            Header: 'Name',
            width: 1,
        }, {
            accessor: 'fee',
            Header: 'Fee',
            width: 1,
        }, ];

    return (
        <>
            <br />
            <ModuleWrapper module={ModuleTypeDimFee} />

            <Table columns={columns} data={operators} />
        </>
    );
}

export default DimFees;
