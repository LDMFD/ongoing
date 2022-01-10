import React, { useContext } from 'react';
import { Link, useParams } from 'react-router-dom';

import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Toolbar from '@mui/material/Toolbar';

import { Context } from 'Store';

const HoldingList = () => {
    const [state, ] = useContext(Context);

    let { clientId } = useParams();
    clientId = parseInt(clientId);

    let client = state.clients.find(c => c.Id === clientId);

    return (
        <div>
            <Toolbar className="breadcrumb-action">
                <Link to={{ pathname: `/clients/id/${client.Id}/holdings/add` }}>
                    <Button>Add asset</Button>
                </Link>
            </Toolbar>

            {client.Holdings?.length &&
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Policy</TableCell>
                                <TableCell>Portfolio</TableCell>
                                <TableCell>Proportion</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {client.Holdings.map(holding => {
                                let policy = client.Policies.find(p => p.Id === holding.PolicyId).ExternalId;
                                let portfolio = state.portfolios.find(p => p.Id === holding.PortfolioId).Name;
                                return (
                                        <TableRow key={holding.Id}>
                                            <TableCell>
                                                <Link to={`/clients/id/${client.Id}/holdings/id/${holding.Id}/edit`} key={policy.Id}>
                                                    #{holding.Id}
                                                </Link>
                                            </TableCell>
                                            <TableCell>
                                                {policy}
                                            </TableCell>
                                            <TableCell>
                                                {portfolio}
                                            </TableCell>
                                            <TableCell>
                                                {holding.Proportion}
                                            </TableCell>
                                        </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            }
        </div>
    );
}

export default HoldingList;
