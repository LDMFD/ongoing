export const DefaultPortfolio = {
    Name: '',
    OperatorId: 'select',
    WeightedFee: '',
    ExAnteFee: '',
};

/*
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

import { Context } from 'Store'
import { SET_PORTFOLIOS } from 'Reducer';

export const PORTFOLIO_TYPES = {
    'dim':        'DIM',
    'firm':       'Firm',
    'individual': 'Individual',
    'none':       'None',
}

const Portfolio = () => {
    let { portfolioId } = useParams();
    portfolioId = parseInt(portfolioId);
    
    const [ state, dispatch ] = useContext(Context);

    const getPortfolios = useCallback(() => {
        return window.ApiClient.get("/portfolios").then(res => {
            dispatch({
                type: SET_PORTFOLIOS,
                payload: res.data,
            });
        });
    }, [ dispatch ]);

    useEffect(() => {
        getPortfolios();
    }, [ getPortfolios ]);

    let portfolio = state.portfolios.find(c => c.Id === portfolioId);

    return portfolio ? (
        <div>
            <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" color="inherit" to='/portfolios'>
                    Portfolios
                </Link>
                <Link underline="hover" color="inherit" to={window.location}>
                    {portfolio.Name}
                </Link>
            </Breadcrumbs>

            <Toolbar className="breadcrumb-action">
                <Link to={{ pathname: `/portfolios/id/${portfolio.Id}/edit` }}><Button>Edit portfolio</Button></Link>
            </Toolbar>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Portfolio</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Fee</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow key={portfolio.Id}>
                            <TableCell>
                                {portfolio.Name}
                            </TableCell>
                            <TableCell>
                                {PORTFOLIO_TYPES[portfolio.Type]}
                            </TableCell>
                            <TableCell>
                                {portfolio.Fee}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            
        </div>
    ) : null;
}

export default Portfolio;
*/
