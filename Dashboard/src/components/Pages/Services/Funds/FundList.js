import React, { useContext, useEffect } from 'react';
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

import { Link } from "react-router-dom";

import { Context } from 'StateProvider'
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
                        {state.Funds?.map(p => {
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
