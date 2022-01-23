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

const PolicyProviderList = () => {
    let history = useHistory();
    const [ state, dispatch] = useContext(Context);

    const getPolicyProviders = useCallback(() => {
        Api.Global.PolicyProviders.Read(dispatch)
    }, [ dispatch ]);

    useEffect(() => {
        getPolicyProviders();
    }, [ getPolicyProviders ]);
    
    const onDelete = useCallback(params => () => {
        if (window.confirm(`Delete policy provider?`)) {
            window.ApiClient.delete(`/policy-providers/${params.row.id}`)
            .then(async () => {
                await Api.Global.PolicyProviders.Read(dispatch);
            });
        }        
    }, [ dispatch ]);

    const onEdit = useCallback(params => () => {
        let id = params.row.id;
        history.push(`/policy-providers/id/${id}/edit`);
    }, [ history ]);

    const columns = [
        { field: 'name',     headerName: 'Name',       flex: 0.1, },
        { field: 'pricing',  headerName: 'Pricing',   flex: 0.1, },
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

    let policyProviders = state.PolicyProviders.map(p => {
        return {
            id:       p.Id,
            name:     p.Name,
            pricing:  p.Pricing,
        };
    });

    let data = {
        rows: policyProviders,
        columns: columns,
    }

    return (
        <>
            <Toolbar className="breadcrumb-action">
                <Link to={{ pathname: '/policy-providers/add' }}><Button>Add new policy provider</Button></Link>
            </Toolbar>

            <DataGrid autoHeight {...data} />
        </>
    );
}

export default PolicyProviderList;
