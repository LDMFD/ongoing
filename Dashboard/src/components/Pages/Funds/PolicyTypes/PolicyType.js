import React, { useEffect, useContext, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';

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

import { Context } from '../../../../Store'
import { SET_POLICY_TYPES } from '../../../../Reducer';

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

    let policyType = state.policyTypes.find(c => c.Id === policyTypeId);

    return policyType ? (
        <div>
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
            
        </div>
    ) : null;
}

export default PolicyType;
