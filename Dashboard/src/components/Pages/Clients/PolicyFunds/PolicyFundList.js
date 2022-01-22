import React, { useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Toolbar
} from '@mui/material';

import { Context } from 'StateProvider';

const PolicyFundList = () => {
    const [state, ] = useContext(Context);

    let { clientId } = useParams();
    clientId = parseInt(clientId);

    let client = state.Clients.find(c => c.Id === clientId);

    return (
        <div>
            <Toolbar className="breadcrumb-action">
                <Link to={{ pathname: `/clients/id/${client.Id}/policy-funds/add` }}>
                    <Button>Add policy fund</Button>
                </Link>
            </Toolbar>

            {client.PolicyFunds?.length &&
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Policy</TableCell>
                                <TableCell>Fund</TableCell>
                                <TableCell>Proportion</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {client.PolicyFunds.map(policyFund => {
                                let policy = client.Policies.find(p => p.Id === policyFund.PolicyId);
                                let fund = state.Funds.find(f => f.Id === policyFund.FundId);
                                return (
                                        <TableRow key={policyFund.Id}>
                                            <TableCell>
                                                <Link to={`/clients/id/${client.Id}/policy-funds/id/${policyFund.Id}/edit`} key={policyFund.Id}>
                                                    #{policyFund.Id}
                                                </Link>
                                            </TableCell>
                                            <TableCell>
                                                {policy.ExternalId}
                                            </TableCell>
                                            <TableCell>
                                                {fund.Name}
                                            </TableCell>
                                            <TableCell>
                                                {policyFund.Proportion}
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

export default PolicyFundList;
