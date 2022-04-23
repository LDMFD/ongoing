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

const RiskProviderList = () => {
    let history = useHistory();
    const [ state, dispatch] = useContext(Context);

    const onDelete = useCallback(params => async () => {
        if (window.confirm(`Delete risk provider?`)) {
            await window.ApiClient.delete(`advisor/risk-providers/${params.row.id}`)
            await Api.Global.Entities.Read(dispatch);
        }        
    }, [ dispatch ]);

    const onEdit = useCallback(params => () => {
        let id = params.row.id;
        history.push(`/risk-providers/id/${id}/edit`);
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

    let riskProviders = state.Entities.RiskProviders.map(p => {
        return {
            id:       p.Id,
            name:     p.Name,
        };
    });

    let data = {
        rows: riskProviders,
        columns: columns,
    }

    return (
        <>
            <Toolbar className="breadcrumb-action">
                <Link to={{ pathname: '/risk-providers/add' }}><Button>Add new risk provider</Button></Link>
            </Toolbar>

            <DataGrid autoHeight {...data} />
        </>
    );
}

export default RiskProviderList;
