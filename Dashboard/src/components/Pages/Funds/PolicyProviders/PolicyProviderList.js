import React, { useEffect, useContext, useCallback } from 'react';

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

import { Context } from '../../../../Store'
import { SET_POLICY_PROVIDERS } from '../../../../Reducer';

const PolicyProviderList = () => {
    const [state, dispatch] = useContext(Context);

    const getPolicyProviders = useCallback(() => {
        window.ApiClient.get("/policy-providers").then(res => {
            console.log(res.data);
            dispatch({
                type: SET_POLICY_PROVIDERS,
                payload: res.data,
            });
        });
    }, [ dispatch ]);

    useEffect(() => {
        getPolicyProviders();
    }, [ getPolicyProviders ]);
    
    console.log(state);
    
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
                        {state.policyProviders && state.policyProviders.map(policyProvider => {
                            return (
                                <TableRow key={policyProvider.Id}>
                                    <TableCell>
                                        <Link to={`/policy-providers/id/${policyProvider.Id}`} key={policyProvider.Id}>
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
