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

const ModelList = () => {
    const [state, ] = useContext(Context);

    return (
        <div className='Models'>
            <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" color="inherit" to={window.location}>
                    Models
                </Link>
            </Breadcrumbs>
        
            <Toolbar className="breadcrumb-action">
                <Link to={{ pathname: '/models/add' }}><Button>Add new model</Button></Link>
            </Toolbar>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Model</TableCell>
                            <TableCell>Operator</TableCell>
                            <TableCell>Weighted OCF</TableCell>
                            <TableCell>Ex Ante Fee</TableCell>
                            <TableCell>Factsheet</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {state.models && state.models.map(p => {
                            let op = state.operators.find(o => o.Id === p.OperatorId);
                            return (
                                <TableRow key={p.Id}>
                                    <TableCell>
                                        <Link to={`/models/id/${p.Id}/edit`} key={p.Id}>
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
                                    <TableCell>
                                        {p.File?.Filename}
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

export default ModelList;
