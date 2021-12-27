import React, { useEffect, useContext, useCallback } from 'react';

import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';

import Day from 'dayjs';
import { Link } from "react-router-dom";

import { Context } from '../../../Store'
import { SET_CLIENTS } from '../../../Reducer';

const ClientList = () => {
    const [state, dispatch] = useContext(Context);

    // let location = useLocation();

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

    if (!state.clients) {
        return 'No data';
    }

    // const refresh = () => {
    //     getClients();
    // };

    // let historyState = {
    //     background: location,
    // };

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
                        {state.clients && state.clients.map(client => {
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
