import React, { useEffect, useContext, useCallback } from 'react';
import {
    Breadcrumbs,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Toolbar,
} from '@mui/material';

import Day from 'dayjs';
import { Link } from "react-router-dom";

import { Context } from 'State/StateProvider'
import { SET_CLIENTS } from 'State/Reducer';

const ClientList = () => {
    const [state, dispatch] = useContext(Context);

    const getClients = useCallback(() => {
        window.ApiClient.get("/clients").then(res => {
            dispatch({
                type: SET_CLIENTS,
                payload: res.data,
            });
        });
    }, [ dispatch ]);

    useEffect(() => {
        getClients();
    }, [getClients]);

    return (
        <div className='Clients'>
            <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" color="inherit" to={window.location}>
                    Clients
                </Link>
            </Breadcrumbs>
        
            <Toolbar className="breadcrumb-action">
                <Link to={{ pathname: '/clients/add' }}><Button>Add new client</Button></Link>
            </Toolbar>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {state.Clients && state.Clients.map(client => {
                            let date = Day(client.Date).toString();
                            return (
                                <TableRow key={client.Id}>
                                    <TableCell>
                                        <Link to={`/clients/id/${client.Id}`} key={client.Id}>
                                            #{client.Id}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        {client.Surname}, {client.Forenames}
                                    </TableCell>
                                    <TableCell>
                                        {date}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default ClientList;
