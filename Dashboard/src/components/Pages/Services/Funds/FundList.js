import React, { useContext, useEffect } from 'react';

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

import { Link } from "react-router-dom";

import { Context } from 'Store'
import { SET_FUNDS } from 'Reducer';

const FundList = () => {
    const [ state, dispatch ] = useContext(Context);

    useEffect(() => {
        window.ApiClient.get(`/funds`).then(res => {
            dispatch({
                type: SET_FUNDS,
                payload: res.data,
            })
        })
    }, [ dispatch ]);

    return (
        <div className='Models'>
            <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" color="inherit" to={window.location}>
                    Funds
                </Link>
            </Breadcrumbs>
        
            <Toolbar className="breadcrumb-action">
                <Link to={{ pathname: '/funds/add' }}><Button>Add new fund</Button></Link>
            </Toolbar>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Weighted OCF</TableCell>
                            <TableCell>Ex Ante Fee</TableCell>
                            <TableCell>SEDOL</TableCell>
                            <TableCell>ISIN</TableCell>
                            <TableCell>Citicode</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {state.funds?.map(p => {
                            return (
                                <TableRow key={p.Id}>
                                    <TableCell>
                                        <Link to={`/funds/id/${p.Id}/edit`} key={p.Id}>
                                            {p.Name}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        {p.WeightedFee}
                                    </TableCell>
                                    <TableCell>
                                        {p.ExAnteFee}
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

export default FundList;
