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
import { SET_OPERATORS } from 'Reducer';
import { OPERATOR_TYPES } from './Operator';

const OperatorList = () => {
    const [state, dispatch] = useContext(Context);

    const getOperators = useCallback(() => {
        window.ApiClient.get("/operators").then(res => {
            dispatch({
                type: SET_OPERATORS,
                payload: res.data,
            });
        });
    }, [ dispatch ]);

    useEffect(() => {
        getOperators();
    }, [ getOperators ]);
    
    return (
        <div className='Operators'>
            <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" color="inherit" to={window.location}>
                    Operators
                </Link>
            </Breadcrumbs>
        
            <Toolbar className="breadcrumb-action">
                <Link to={{ pathname: '/operators/add' }}><Button>Add new operator</Button></Link>
            </Toolbar>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Operator</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Fee</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {state.operators && state.operators.map(operator => {
                            return (
                                <TableRow key={operator.Id}>
                                    <TableCell>
                                        <Link to={`/operators/id/${operator.Id}/edit`} key={operator.Id}>
                                            {operator.Name}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        {OPERATOR_TYPES[operator.Type]}
                                    </TableCell>
                                    <TableCell>
                                        {operator.Fee}
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

export default OperatorList;
