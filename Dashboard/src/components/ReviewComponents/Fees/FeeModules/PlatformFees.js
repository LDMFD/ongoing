import React, { useContext  } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { ModuleTypePolicyFees } from 'State/ApiCommands/Global/Reviews/ModuleTypes';
import { Context } from 'State';
import ModuleWrapper from 'components/Pages/Clients/Reviews/Modules/ModuleWrapper';

const PlatformFees = () => {
    const [state,  ] = useContext(Context);
    let client = state.ClientContext;

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
            rows.push({
                provider: policy.PolicyProvider,
                policies: [ policy ],
                platformDiscount: policy.PlatformDiscount,
                pricing: policy.PlatformDiscount ? policy.PlatformDiscount : policy.PolicyProvider.Pricing,
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
            <ModuleWrapper client={client}
                           module={ModuleTypePolicyFees} />

            <DataGrid autoHeight {...data} />
        </>
    );
}

export default PlatformFees;
