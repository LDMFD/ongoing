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
import { SET_POLICY_TYPES } from 'Reducer';

const PolicyTypeList = () => {
    const [state, dispatch] = useContext(Context);

    const getPolicyTypes = useCallback(() => {
        window.ApiClient.get("/policy-types").then(res => {
            dispatch({
                type: SET_POLICY_TYPES,
                payload: res.data,
            });
        });
    }, [ dispatch ]);

    useEffect(() => {
        getPolicyTypes();
    }, [ getPolicyTypes ]);
    
    return (
        <div className='PolicyTypes'>
            <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" color="inherit" to={window.location}>
                    Policy Types
                </Link>
            </Breadcrumbs>
        
            <Toolbar className="breadcrumb-action">
                <Link to={{ pathname: '/policy-types/add' }}><Button>Add new policy type</Button></Link>
            </Toolbar>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Policy Type</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {state.PolicyTypes && state.PolicyTypes.map(policyType => {
                            return (
                                <TableRow key={policyType.Id}>
                                    <TableCell>
                                        <Link to={`/policy-types/id/${policyType.Id}/edit`} key={policyType.Id}>
                                            {policyType.Name}
                                        </Link>
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

export default PolicyTypeList;
