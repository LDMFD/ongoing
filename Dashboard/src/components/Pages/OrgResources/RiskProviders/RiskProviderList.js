import React, { useContext, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
    Button,
    Toolbar,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { Context, Api } from 'State'
import Table from 'Components/Library/Table/Table';

const RiskProviderList = () => {
    let history = useHistory();
    const [ state, dispatch] = useContext(Context);

    const onDelete = useCallback(id => async () => {
        if (window.confirm(`Delete risk provider?`)) {
            await window.ApiClient.delete(`advisor/risk-providers/${id}`)
            await Api.OrgResources.Entities.Read(dispatch);
        }        
    }, [ dispatch ]);

    const onEdit = useCallback(id => () => {
        history.push(`/risk-providers/id/${id}/edit`);
    }, [ history ]);

    const columns = [
        {
            accessor: 'name',
            Header: 'Name',
            width: 1,
        }, {
            accessor: 'actions',
            Header: '',
            width: 1,
            Cell: ({ row }) => (
                <>
                    <button onClick={onEdit(row.original.id)} className='ong-openFileIcon'>
                        <EditIcon />
                    </button>
                    <button onClick={onDelete(row.original.id)} className='ong-openFileIcon'>
                        <DeleteIcon />
                    </button>
                </>
            ),
        },
    ];

    let riskProviders = state.Resources.RiskProviders.map(p => {
        return {
            id:       p.Id,
            name:     p.Name,
        };
    });

    return (
        <>
            <Toolbar className="breadcrumb-action">
                <Link to={{ pathname: '/risk-providers/add' }}><Button>Add new risk provider</Button></Link>
            </Toolbar>

            <Table columns={columns} data={riskProviders} />
        </>
    );
}

export default RiskProviderList;
