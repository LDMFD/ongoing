import React, { useEffect, useContext, useCallback } from 'react';

import { Context, Api } from 'State'
import Table from 'Components/Library/Table/Table';
import { OPERATOR_TYPES } from './OperatorTypes';

const OperatorList = () => {
    const [ state, dispatch] = useContext(Context);

    const getOperators = useCallback(() => {
        Api.OrgResources.Entities.Read(dispatch)
    }, [ dispatch ]);

    useEffect(() => {
        getOperators();
    }, [ getOperators ]);
    
    const columns = [
        {
            id: 'name',
            header: 'Name',
            width: 400,
        },
        {
            id: 'type',
            header: 'Type',
            width: 200,
        },
        {
            id: 'fee',
            header: 'Fee',
        },
    ];

    let operators = state.Resources.Operators.map(p => {
        return {
            id:       p.Id,
            name:     p.Name,
            type:     OPERATOR_TYPES[p.Type],
            fee:      `${p.Fee}%`,
        };
    });

    return (
        <Table
            flexibleColumn = {3}
            columns        = {columns}
            data           = {operators}
            resource       = 'operators'
            label          = 'Operator'
        />
    );
}

export default OperatorList;
