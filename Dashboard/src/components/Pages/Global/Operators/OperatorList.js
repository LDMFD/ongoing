import React, { useEffect, useContext, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import {
    Button,
    Toolbar,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { Context, Api } from 'State'
import { OPERATOR_TYPES } from './OperatorTypes';

const OperatorList = () => {
    let history = useHistory();
    const [ state, dispatch] = useContext(Context);

    const getOperators = useCallback(() => {
        Api.Global.Entities.Read(dispatch)
    }, [ dispatch ]);

    useEffect(() => {
        getOperators();
    }, [ getOperators ]);
    
    const onDelete = useCallback(params => () => {
        if (window.confirm(`Delete operator?`)) {
            window.ApiClient.delete(`advisor/operators/${params.row.id}`)
            .then(async () => {
                await Api.Global.Entities.Read(dispatch);
            });
        }        
    }, [ dispatch ]);

    const onEdit = useCallback(params => () => {
        let id = params.row.id;
        history.push(`/operators/id/${id}/edit`);
    }, [ history ]);

    const columns = [
        { field: 'name', headerName: 'Name', flex: 0.1, },
        { field: 'type', headerName: 'Type', flex: 0.1, },
        { field: 'fee',  headerName: 'Fee',  flex: 0.1, },
        {
            field: 'actions',
            type: 'actions',
            flex: .05,
            getActions: (params) => [
                <GridActionsCellItem icon={<EditIcon />}   onClick={onEdit(params)}   label="Edit" />,
                <GridActionsCellItem icon={<DeleteIcon />} onClick={onDelete(params)} label="Delete" />,
            ]
        },
    ];

    let operators = state.Entities.Operators.map(p => {
        return {
            id:       p.Id,
            name:     p.Name,
            type:     OPERATOR_TYPES[p.Type],
            fee:      p.Fee,
        };
    });

    let data = {
        rows: operators,
        columns: columns,
    }

    return (
        <>
            <Toolbar className="breadcrumb-action">
                <Link to={{ pathname: '/operators/add' }}><Button>Add new operator</Button></Link>
            </Toolbar>

            <DataGrid autoHeight {...data} />
        </>
    );
}

export default OperatorList;
