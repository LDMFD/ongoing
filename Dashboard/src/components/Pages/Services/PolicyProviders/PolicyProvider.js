import React, { useEffect, useContext, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
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

import { Context } from 'State/StateProvider'
import { SET_POLICY_PROVIDERS } from 'State/Reducer';

const PolicyProvider = () => {
    let { policyProviderId } = useParams();
    policyProviderId = parseInt(policyProviderId);
    
    const [ state, dispatch ] = useContext(Context);

    const getPolicyProviders = useCallback(() => {
        return window.ApiClient.get("/policy-providers").then(res => {
            dispatch({
                type: SET_POLICY_PROVIDERS,
                payload: res.data,
            });
        });
    }, [ dispatch ]);

    useEffect(() => {
        getPolicyProviders();
    }, [ getPolicyProviders ]);

    let policyProvider = state.PolicyProviders.find(c => c.Id === policyProviderId);

    return (
        <>
            <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" color="inherit" to='/policy-providers'>
                    Policy Providers
                </Link>
                <Link underline="hover" color="inherit" to={window.location}>
                    {policyProvider.Name}
                </Link>
            </Breadcrumbs>

            <Toolbar className="breadcrumb-action">
                <Link to={{ pathname: `/policy-providers/id/${policyProvider.Id}/edit` }}><Button>Edit policy provider</Button></Link>
            </Toolbar>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Pricing</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow key={policyProvider.Id}>
                            <TableCell>
                                {policyProvider.Name}
                            </TableCell>
                            <TableCell>
                                {policyProvider.Pricing}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            
        </>
    ) : null;
}

export default PolicyProvider;
