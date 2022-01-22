import React, { useEffect, useContext, useCallback } from 'react';
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
import { SET_POLICY_PROVIDERS } from 'Reducer';

const PolicyProviderList = () => {
    const [state, dispatch] = useContext(Context);

    const getPolicyProviders = useCallback(() => {
        window.ApiClient.get("/policy-providers").then(res => {
            dispatch({
                type: SET_POLICY_PROVIDERS,
                payload: res.data,
            });
        });
    }, [ dispatch ]);

    useEffect(() => {
        getPolicyProviders();
    }, [ getPolicyProviders ]);
    
    return (
        <div className='PolicyProviders'>
            <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" color="inherit" to={window.location}>
                    Policy Providers
                </Link>
            </Breadcrumbs>
        
            <Toolbar className="breadcrumb-action">
                <Link to={{ pathname: '/policy-providers/add' }}><Button>Add new policy provider</Button></Link>
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
                        {state.PolicyProviders && state.PolicyProviders.map(policyProvider => {
                            return (
                                <TableRow key={policyProvider.Id}>
                                    <TableCell>
                                        <Link to={`/policy-providers/id/${policyProvider.Id}/edit`} key={policyProvider.Id}>
                                            {policyProvider.Name}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        {policyProvider.Pricing}
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

export default PolicyProviderList;
