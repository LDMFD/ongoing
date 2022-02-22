import React, {  } from 'react';
import { useParams,  } from 'react-router-dom';
import {
    Paper,
} from '@mui/material';
import { EditModuleComponent } from '../../EditModule';
import { ModuleTypeValuation } from 'State/ApiCommands/Global/Reviews/ModuleTypes';

const PolicyContributions = ({ policy }) => {
    let { clientId, reviewId } = useParams();
    clientId = parseInt(clientId);
    reviewId = parseInt(reviewId);

    let contributions;
    switch (policy.MonthlyContributions) {
        case null: 
            contributions = 'Data not provided';
            break;
        case 0:
            contributions = 'No regular contributions';
            break;
        default:
            contributions = 'Annual regular contributions';
            break;
    }

    return (
        <Paper>
            <h2>
                Policy Contributions
            </h2>
            <EditModuleComponent clientId = {clientId}
                                 reviewId = {reviewId}
                                 module   = {ModuleTypeValuation} />

            Monthly contributions: {contributions} ({policy.MonthlyContributions})<br />
        </Paper>
    );
}

export default PolicyContributions;
