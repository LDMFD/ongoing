import React, { useContext } from 'react';
import { useParams,  } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { ModuleTypePolicyFees } from 'State/ApiCommands/Global/Reviews/ModuleTypes';
import { ModuleEditor } from '../../../EditModule';

import { Context } from 'State'

const PlatformFees = () => {
    const [ state, ] = useContext(Context);

    let { clientId, reviewId } = useParams();
    clientId = parseInt(clientId);
    reviewId = parseInt(reviewId);

    clientId = parseInt(clientId);

    let client = state.Clients.find(c => c.Id === clientId);

    let rows = [ /*{
        provider: Provider
        policies: []Policy,
        pricing:  string,
        platformDiscount: float,
    }*/ ];

    client.Policies.forEach(policy => {
        let found = false;
        rows.forEach(row => {
            if (row.provider.Id !== policy.PolicyProviderId || row.platformDiscount !== policy.PlatformDiscount) {
                return;
            }
            if (!row.policies.includes(p => p.Id === policy.Id)) {
                row.policies.push(policy);
            }
            found = true;
        });
        if (!found) {
            let provider = state.PolicyProviders.find(p => p.Id === policy.PolicyProviderId);
            rows.push({
                provider: provider,
                policies: [ policy ],
                platformDiscount: policy.PlatformDiscount,
                pricing: policy.PlatformDiscount ? policy.PlatformDiscount : provider.Pricing,
            })
        }
    });

    let ix = 0;
    let tableRows = rows.map(r => {
        return {
            id:       ix++,
            provider: r.provider.Name,
            policies: r.policies.map(p => p.ExternalId).join(', '),
            pricing:  r.pricing,
        }
    });

    const columns = [
        { field: 'provider', headerName: 'Provider', flex: 0.1, },
        { field: 'policies', headerName: 'Policies', flex: 0.1, },
        { field: 'pricing',  headerName: 'Pricing',  flex: 0.1, },
    ];

    let data = {
        rows: tableRows,
        columns: columns,
    }

    return (
        <>
            <br />
            <ModuleEditor clientId = {clientId}
                          reviewId = {reviewId}
                          module   = {ModuleTypePolicyFees} />

            <DataGrid autoHeight {...data} />
        </>
    );
}

export default PlatformFees;
