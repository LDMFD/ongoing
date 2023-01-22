import React, { useContext, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Button,
    Toolbar,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { Api, Context } from 'State'
import Table from 'Components/Library/Table/Table';
import IconGroup from 'Components/Library/IconGroup/IconGroup';

const PolicyProviderList = () => {
    const [ state, dispatch ] = useContext(Context);

    const sync = useCallback(() => {
        Api.OrgResources.Entities.Read(dispatch)
    }, [ dispatch ]);

    useEffect(() => {
        sync();
    }, [ sync ]);

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
            width: 1,
            Cell: ({ row }) => (
                <IconGroup>
                    <Link to={`/policy-providers/id/${row.original.id}/delete`}>
                        <DeleteIcon />
                    </Link>
                    <Link to={`/policy-providers/id/${row.original.id}/edit`}>
                        <EditIcon />
                    </Link>
                </IconGroup>
            ),
        },
    ];

    let policyProviders = state.Resources.PolicyProviders.map(p => {
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
