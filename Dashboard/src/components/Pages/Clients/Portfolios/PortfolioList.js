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

const PortfolioList = () => {
    const [state, ] = useContext(Context);

    let { clientId } = useParams();
    clientId = parseInt(clientId);

    let client = state.clients.find(c => c.Id === clientId);

    return (
        <div>
            <Toolbar className="breadcrumb-action">
                <Link to={{ pathname: `/clients/id/${client.Id}/portfolios/add` }}>
                    <Button>Add portfolio</Button>
                </Link>
            </Toolbar>

            {client.Portfolios?.length &&
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Policy</TableCell>
                                <TableCell>Model</TableCell>
                                <TableCell>Proportion</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {client.Portfolios.map(portfolio => {
                                let policy = client.Policies.find(p => p.Id === portfolio.PolicyId).ExternalId;
                                let model = state.models.find(p => p.Id === portfolio.ModelId).Name;
                                return (
                                        <TableRow key={portfolio.Id}>
                                            <TableCell>
                                                <Link to={`/clients/id/${client.Id}/portfolios/id/${portfolio.Id}/edit`} key={policy.Id}>
                                                    #{portfolio.Id}
                                                </Link>
                                            </TableCell>
                                            <TableCell>
                                                {policy}
                                            </TableCell>
                                            <TableCell>
                                                {model}
                                            </TableCell>
                                            <TableCell>
                                                {portfolio.Proportion}
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

export default PortfolioList;
