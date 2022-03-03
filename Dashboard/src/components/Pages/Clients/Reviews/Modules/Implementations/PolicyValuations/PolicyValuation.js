import React, {  } from 'react';
import { useParams,  } from 'react-router-dom';
import {
    Paper,
} from '@mui/material';
import { ModuleEditor } from '../../EditModule';
import { ModuleTypeValuation } from 'State/ApiCommands/Global/Reviews/ModuleTypes';
import { CurrencyFormatter } from 'Utils/Strings';

const PolicyValuation = ({ policy }) => {
    let { clientId, reviewId } = useParams();
    clientId = parseInt(clientId);
    reviewId = parseInt(reviewId);

    return (
        <Paper>
            <h4>
                Valuation
            </h4>
            <ModuleEditor clientId = {clientId}
                          reviewId = {reviewId}
                          module   = {ModuleTypeValuation} />

            Start value: {CurrencyFormatter.format(policy.StartValue)}<br />
            End value: {CurrencyFormatter.format(policy.EndValue)}
        </Paper>
    );
}

export default PolicyValuation;
