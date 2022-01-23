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
import { SET_POLICY_TYPES } from 'State/Reducer';

const PolicyType = () => {
    let { policyTypeId } = useParams();
    policyTypeId = parseInt(policyTypeId);
    
    const [ state, dispatch ] = useContext(Context);

    const getPolicyTypes = useCallback(() => {
        return window.ApiClient.get("/policy-types").then(res => {
            dispatch({
                type: SET_POLICY_TYPES,
                payload: res.data,
            });
        });
    }, [ dispatch ]);

    useEffect(() => {
        getPolicyTypes();
    }, [ getPolicyTypes ]);

    let policyType = state.PolicyTypes.find(c => c.Id === policyTypeId);

    return (
        <>
            <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" color="inherit" to='/policy-types'>
                    Policy Types
                </Link>
                <Link underline="hover" color="inherit" to={window.location}>
                    {policyType.Name}
                </Link>
            </Breadcrumbs>

            <Toolbar className="breadcrumb-action">
                <Link to={{ pathname: `/policy-types/id/${policyType.Id}/edit` }}><Button>Edit policy type</Button></Link>
            </Toolbar>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Policy Type</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow key={policyType.Id}>
                            <TableCell>
                                {policyType.Name}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}

export default PolicyType;
