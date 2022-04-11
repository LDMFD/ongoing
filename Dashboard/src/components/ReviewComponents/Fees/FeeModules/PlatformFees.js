import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { ModuleTypePolicyFees } from 'State/ApiCommands/Global/Reviews/ModuleTypes';
import ModuleWrapper from 'Components/Pages/Advisor/Reviews/Modules/ModuleWrapper';
import { GetReport } from 'Components/ReviewComponents/GetReport';

const PlatformFees = () => {
    let report = GetReport();

    let rows = [ /*{
        provider: Provider
        policies: []Policy,
        pricing:  string,
        platformDiscount: float,
    }*/ ];

    report.Policies.forEach(policy => {
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
            let provider = report.PolicyProviders.find(pp => pp.Id === policy.PolicyProviderId);
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

        // Placeholder

        let providerCharges = report.ProviderCharges
            .filter(pc => pc.ProviderId === r.provider.Id)
            .map(c => `${c.Desc} - ${c.Charge}`)

        let pricing = r.provider.Pricing.replace('{{ charges }}', providerCharges.join('<br />'));

        return {
            id:       ix++,
            provider: r.provider.Name,
            policies: r.policies.map(p => p.ExternalId).join(', '),
            pricing:  pricing,
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
            <ModuleWrapper module={ModuleTypePolicyFees} />

            <DataGrid autoHeight {...data} />
        </>
    );
}

export default PlatformFees;
