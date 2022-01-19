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
    Toolbar,
} from '@mui/material';

import { Context } from 'Store';

const PolicyList = () => {
    const [state, ] = useContext(Context);

    let { clientId } = useParams();
    clientId = parseInt(clientId);

    let client = state.clients.find(c => c.Id === clientId);

    if (!state.policyTypes?.length || !state.policyProviders?.length) {
        return null;
    }

    return (
        <>
            <Toolbar className="breadcrumb-action">
                <Link to={{ pathname: `/clients/id/${client.Id}/policies/add` }}><Button>Add policy</Button></Link>
            </Toolbar>

            {client?.Policies?.length &&
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Policy Number</TableCell>
                                <TableCell>Platform Discount</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Provider</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {client.Policies.map(policy => {
                                let type = state.policyTypes.find(t => t.Id === policy.PolicyTypeId).Name;
                                let provider = state.policyProviders.find(t => t.Id === policy.PolicyProviderId).Name;
                                return (
                                    <TableRow key={policy.Id}>
                                        <TableCell>
                                            <Link to={`/clients/id/${client.Id}/policies/id/${policy.Id}/edit`} key={policy.Id}>
                                                #{policy.Id}
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            {policy.ExternalId}
                                        </TableCell>
                                        <TableCell>
                                            {policy.PlatformDiscount}
                                        </TableCell>
                                        <TableCell>
                                            {type}
                                        </TableCell>
                                        <TableCell>
                                            {provider}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            }
        </>
    );
}

export default PolicyList;
