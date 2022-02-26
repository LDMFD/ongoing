import React, {  } from 'react';
import { useParams,  } from 'react-router-dom';
import {
    Paper,
} from '@mui/material';
import { EditModuleComponent } from '../../EditModule';
import { ModuleTypeValuation } from 'State/ApiCommands/Global/Reviews/ModuleTypes';

const PolicyValuation = ({ policy }) => {
    let { clientId, reviewId } = useParams();
    clientId = parseInt(clientId);
    reviewId = parseInt(reviewId);

    return (
        <Paper>
            <h4>
                Valuation
            </h4>
            <EditModuleComponent clientId = {clientId}
                                 reviewId = {reviewId}
                                 module   = {ModuleTypeValuation} />

            start value: {policy.StartValue}<br />
            end value: {policy.EndValue}
        </Paper>
    );
}

export default PolicyValuation;
