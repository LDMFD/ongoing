import React, {  } from 'react';
import { useParams,  } from 'react-router-dom';
import {
    Paper,
} from '@mui/material';
import { ModuleEditor } from '../EditModule';
import { ModuleTypeFundLevelFees, ModuleTypePortfolioLevelFees } from 'State/ApiCommands/Global/Reviews/ModuleTypes';

const Fees = () => {
    let { clientId, reviewId } = useParams();
    clientId = parseInt(clientId);
    reviewId = parseInt(reviewId);

    return (
        <>
            <h1>
                Fees - Fund Fees
            </h1>
            <Paper>
                <h2>
                    Portfolio-Level Fees
                </h2>
                <ModuleEditor clientId = {clientId}
                                     reviewId = {reviewId}
                                     module   = {ModuleTypePortfolioLevelFees} />
            </Paper>

            <Paper>
                <h2>
                    Fund-Level Fees
                </h2>
                <ModuleEditor clientId = {clientId}
                                     reviewId = {reviewId}
                                     module   = {ModuleTypeFundLevelFees} />
            </Paper>
        </>
    );
}

export default Fees;
