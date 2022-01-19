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

import { Context } from 'Store'
import { SET_OPERATORS } from 'Reducer';

export const OPERATOR_TYPES = {
    'dim':        'DIM',
    'firm':       'Firm',
    'individual': 'Individual',
    'none':       'None',
}

const Operator = () => {
    let { operatorId } = useParams();
    operatorId = parseInt(operatorId);
    
    const [ state, dispatch ] = useContext(Context);

    const getOperators = useCallback(() => {
        return window.ApiClient.get("/operators").then(res => {
            dispatch({
                type: SET_OPERATORS,
                payload: res.data,
            });
        });
    }, [ dispatch ]);

    useEffect(() => {
        getOperators();
    }, [ getOperators ]);

    let operator = state.operators.find(c => c.Id === operatorId);

    return operator ? (
        <div>
            <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" color="inherit" to='/operators'>
                    Operators
                </Link>
                <Link underline="hover" color="inherit" to={window.location}>
                    {operator.Name}
                </Link>
            </Breadcrumbs>

            <Toolbar className="breadcrumb-action">
                <Link to={{ pathname: `/operators/id/${operator.Id}/edit` }}><Button>Edit operator</Button></Link>
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
                        <TableRow key={operator.Id}>
                            <TableCell>
                                {operator.Name}
                            </TableCell>
                            <TableCell>
                                {OPERATOR_TYPES[operator.Type]}
                            </TableCell>
                            <TableCell>
                                {operator.Fee}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            
        </div>
    ) : null;
}

export default Operator;
