import React, { useContext, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import {
    Button,
    Toolbar,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { Context, Api } from 'State'

const PolicyTypeList = () => {
    let history = useHistory();
    const [ state, dispatch] = useContext(Context);

    const onDelete = useCallback(params => async () => {
        if (window.confirm(`Delete policy type?`)) {
            await Api.Global.PolicyTypes.Delete(params.row.id)
            await Api.Global.PolicyTypes.Read(dispatch);
        }        
    }, [ dispatch ]);

    const onEdit = useCallback(params => () => {
        history.push(`/policy-types/id/${params.row.id}/edit`);
    }, [ history ]);

    const columns = [
        { field: 'name',     headerName: 'Name',       flex: 0.1, },
        {
            field: 'actions',
            type: 'actions',
            flex: .01,
            getActions: (params) => [
                <GridActionsCellItem icon={<EditIcon />}   onClick={onEdit(params)}   label="Edit" />,
                <GridActionsCellItem icon={<DeleteIcon />} onClick={onDelete(params)} label="Delete" />,
            ]
        },
    ];

    let policyTypes = state.PolicyTypes.map(p => {
        return {
            id:       p.Id,
            name:     p.Name,
        };
    });

    let data = {
        rows: policyTypes,
        columns: columns,
    }

    return (
        <>
            <Toolbar className="breadcrumb-action">
                <Link to={{ pathname: '/policy-Types/add' }}><Button>Add new policy type</Button></Link>
            </Toolbar>

            <DataGrid autoHeight {...data} />
        </>
    );
}

export default PolicyTypeList;
