import React, { useContext } from 'react';

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

const PortfolioList = () => {
    const [state, ] = useContext(Context);

    return (
        <div className='Portfolios'>
            <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" color="inherit" to={window.location}>
                    Portfolios
                </Link>
            </Breadcrumbs>
        
            <Toolbar className="breadcrumb-action">
                <Link to={{ pathname: '/portfolios/add' }}><Button>Add new portfolio</Button></Link>
            </Toolbar>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Portfolio</TableCell>
                            <TableCell>Operator</TableCell>
                            <TableCell>Weighted OCF</TableCell>
                            <TableCell>Ex Ante Fee</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {state.portfolios && state.portfolios.map(p => {
                            let op = state.operators.find(o => o.Id === p.OperatorId);
                            return (
                                <TableRow key={p.Id}>
                                    <TableCell>
                                        <Link to={`/portfolios/id/${p.Id}/edit`} key={p.Id}>
                                            {p.Name}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        {op.Name}
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

export default PortfolioList;
