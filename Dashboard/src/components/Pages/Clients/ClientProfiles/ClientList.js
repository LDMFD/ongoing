import React, { useContext, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import {
    Button,
    Toolbar,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';

import { Context, Api } from 'State'

const ClientList = () => {
    let history = useHistory();
    const [ state, dispatch ] = useContext(Context);

    const onDelete = useCallback(params => async () => {
        if (window.confirm(`Delete client?`)) {
            await Api.Clients.ClientDetail.Delete(params.row.id)
            await Api.Clients.Clients.Read(dispatch);
        }        
    }, [ dispatch ]);

    const onOpen = useCallback(params => () => {
        history.push(`/clients/id/${params.row.id}`);
    }, [ history ]);

    const columns = [
        { field: 'idLabel',  headerName: 'Client ID',  flex: 0.1, },
        { field: 'name',     headerName: 'Name',       flex: 0.1, },
        {
            field: 'actions',
            type: 'actions',
            flex: .01,
            getActions: (params) => [
                <GridActionsCellItem icon={<MeetingRoomIcon />}   onClick={onOpen(params)}   label="Open" />,
                <GridActionsCellItem icon={<DeleteIcon />}        onClick={onDelete(params)} label="Delete" />,
            ]
        },
    ];

    let clients = state.Clients.map(c => {
        return {
            id:       c.Id,
            idLabel:  `#${c.Id}`,
            name:     `${c.Identity.Surname}, ${c.Identity.Forenames}`,
        };
    });

    let data = {
        rows: clients,
        columns: columns,
    }

    return (
        <>
            <Toolbar className="breadcrumb-action">
                <Link to={{ pathname: '/clients/add' }}><Button>Add new client</Button></Link>
            </Toolbar>

            <DataGrid autoHeight {...data} />
        </>
    );
}

export default ClientList;
