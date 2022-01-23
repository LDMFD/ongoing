import React, { useContext } from 'react';
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

import { Context } from 'State/StateProvider'

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
                        {state.Models && state.Models.map(p => {
                            let op = state.Operators.find(o => o.Id === p.OperatorId);
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
