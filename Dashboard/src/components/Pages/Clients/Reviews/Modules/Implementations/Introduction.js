import React, { useContext,  } from 'react';
import { useParams,  } from 'react-router-dom';
import {
    Paper,
} from '@mui/material';

import { Context,  } from 'State'
import { ModuleEditor } from '../EditModule';
import { ModuleTypeIntroduction } from 'State/ApiCommands/Global/Reviews/ModuleTypes';
import { CurrencyFormatter } from 'Utils/Strings';

const Introduction = () => {
    const [state,  ] = useContext(Context);

    let { clientId, reviewId } = useParams();
    clientId = parseInt(clientId);

    let client = state.Clients.find(c => c.Id === clientId);

    let totalStarting = client.Policies.map(p => p.StartValue).reduce((p, q) => p + q, 0);
    let totalEnding   = client.Policies.map(p => p.EndValue).reduce((p, q) => p + q, 0);

    return (
        <Paper>
            <h2>
                Introduction
            </h2>

            <ModuleEditor clientId = {clientId}
                                 reviewId = {reviewId}
                                 module   = {ModuleTypeIntroduction} />

            <p>
                Total start value: {CurrencyFormatter.format(totalStarting)}<br />
                Total end value: {CurrencyFormatter.format(totalEnding)}
            </p>

        </Paper>
    );
}

export default Introduction;
