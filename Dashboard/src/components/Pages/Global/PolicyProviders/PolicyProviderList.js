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

const PolicyProviderList = () => {
    let history = useHistory();
    const [ state, dispatch] = useContext(Context);

    const onDelete = useCallback(id => async () => {
        if (window.confirm(`Delete policy provider?`)) {
            await window.ApiClient.delete(`advisor/policy-providers/${id}`)
            await Api.Global.Entities.Read(dispatch);
        }        
    }, [ dispatch ]);

    const onEdit = useCallback(id => () => {
        history.push(`/policy-providers/id/${id}/edit`);
    }, [ history ]);

    const columns = [
        {
            accessor: 'name',
            Header: 'Name',
            width: 1,
        }, {
            accessor: 'pricing',
            Header: 'Pricing',
            width: 3,
            Cell: ({ row }) => (
                row.original.pricing && (
                    <div className='ong-notes' dangerouslySetInnerHTML={{ __html: row.original.pricing }} />
                )
            ),
        }, {
            accessor: 'customPricing',
            Header: 'Custom Pricing',
            width: 3,
            Cell: ({ row }) => (
                row.original.pricing && (
                    <div className='ong-notes' dangerouslySetInnerHTML={{ __html: row.original.customPricing }} />
                )
            ),
        }, {
            accessor: 'actions',
            Header: '',
            width: 0.5,
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

    let policyProviders = state.Entities.PolicyProviders.map(p => {
        return {
            id:            p.Id,
            name:          p.Name,
            pricing:       p.Pricing,
            customPricing: p.CustomPricing,
        };
    });

    return (
        <>
            <Toolbar className="breadcrumb-action">
                <Link to={{ pathname: '/policy-providers/add' }}><Button>Add new policy provider</Button></Link>
            </Toolbar>

            <Table columns={columns} data={policyProviders} />
        </>
    );
}

export default PolicyProviderList;
