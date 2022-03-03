import React, { useContext,  } from 'react';
import { useParams,  } from 'react-router-dom';
import {
    Paper,
} from '@mui/material';

import { Context,  } from 'State'
import PolicyValuation from './PolicyValuation';
import PolicyContributions from './PolicyContributions';

const PolicyValuations = () => {
    const [state,  ] = useContext(Context);

    let { clientId } = useParams();
    clientId = parseInt(clientId);

    let client = state.Clients.find(c => c.Id === clientId);

    return (
        <div>
            <h2>
                Policy Valuations
            </h2>
            {client.Policies.map(p => (
                <Paper elevation={2} key={p.Id}>
                    <h3>
                        {p.ExternalId}
                    </h3>
                    <PolicyValuation policy={p} />
                    <PolicyContributions policy={p} />
                </Paper>
            ))}
        </div>
    );
}

export default PolicyValuations;
