import React, { useEffect, useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
    Button,
    Toolbar,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { Context, Api } from 'State'
import IconGroup from 'Components/Library/IconGroup/IconGroup';
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
            accessor: 'name',
            Header: 'Name',
            width: 1,
        },
        {
            accessor: 'type',
            Header: 'Type',
            width: 1,
        },
        {
            accessor: 'fee',
            Header: 'Fee',
            width: 1,
        },
        {
            accessor: 'actions',
            Header: '',
            width: .5,
            Cell: ({ row }) => (
                <IconGroup>
                    <Link to={`/operators/id/${row.original.id}/delete`}>
                        <DeleteIcon />
                    </Link>
                    <Link to={`/operators/id/${row.original.id}/edit`}>
                        <EditIcon />
                    </Link>
                </IconGroup>
            ),
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
        <>
            <Toolbar className="breadcrumb-action">
                <Link to={{ pathname: '/operators/add' }}><Button>Add new operator</Button></Link>
            </Toolbar>

            <Table columns={columns} data={operators} />
        </>
    );
}

export default OperatorList;
