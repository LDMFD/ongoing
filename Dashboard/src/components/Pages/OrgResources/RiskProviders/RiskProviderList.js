import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import {
    Button,
    Toolbar,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { Context } from 'State'
import Table from 'Components/Library/Table/Table';
import IconGroup from 'Components/Library/IconGroup/IconGroup';

const RiskProviderList = () => {
    const [ state ] = useContext(Context);

    const columns = [
        {
            accessor: 'name',
            Header: 'Name',
            width: 1,
        }, {
            accessor: 'actions',
            Header: '',
            width: .1,
            Cell: ({ row }) => (
                <IconGroup>
                    <Link to={`/risk-providers/id/${row.original.id}/delete`}>
                        <DeleteIcon />
                    </Link>
                    <Link to={`/risk-providers/id/${row.original.id}/edit`}>
                        <EditIcon />
                    </Link>
                </IconGroup>
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
