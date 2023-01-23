import React, { useContext, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Button,
    Toolbar,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import IconGroup from 'Components/Library/IconGroup/IconGroup';

import { Context, Api } from 'State'
import OgTable from 'Components/Library/Table/Table';

const ClientList = () => {
    const [ state, dispatch ] = useContext(Context);

    const sync = useCallback(() => {
        Api.Advisor.Clients.Read(dispatch)
    }, [ dispatch ]);

    useEffect(() => {
        sync();
    }, [ sync ]);

    const columns = [
        {
            accessor: 'name',
            Header: 'Name',
            width: .5,
            Cell: ({ row }) => <Link to={`/clients/id/${row.original.id}`}>{row.original.name}</Link>
        }, {
            accessor: 'email',
            Header: 'Email',
            width: .5,
        }, {
            accessor: 'fee',
            Header: 'Fee',
            width: 0.3,
        }, {
            accessor: 'actions',
            Header: '',
            width: .1,
            Cell: ({ row }) => (
                <IconGroup>
                    <Link to={`/clients/delete/id/${row.original.id}`}>
                        <DeleteIcon />
                    </Link>
                </IconGroup>
            ),
        },
    ];

    let clients = state.Clients.map(c => {
        return {
            id:       c.Id,
            idLabel:  `#${c.Id}`,
            name:     `${c.Identity.Surname}, ${c.Identity.Forenames}`,
            email:    c.Identity.Email,
            fee:      `${c.Fee}%`,
        };
    });

    return (
        <>
            <Toolbar className="breadcrumb-action">
                <Link to={{ pathname: '/clients/add' }}><Button>Add new client</Button></Link>
            </Toolbar>

            <OgTable columns={columns} data={clients} />
        </>
    );
}

export default ClientList;
