import React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { ModuleTypePolicyFees } from 'State/ApiCommands/Global/Reviews/ModuleTypes';
import ModuleWrapper from 'Components/Pages/Advisor/Reviews/Modules/ModuleWrapper';
import { GetReport } from 'Components/ReviewComponents/GetReport';
import Table from 'Components/Widgets/Table';

const PlatformFees = () => {
    let report = GetReport();

    const columns = [{
            accessor: 'provider',
            Header: 'Provider',
            width: 1,
        }, {
            accessor: 'policies',
            Header: 'Policies',
            width: 1,
        }, {
            accessor: 'pricing',
            Header: 'Pricing',
            width: 4,
            Cell: ({ row }) => (
                row.original.pricing && (
                    <div className='ong-notes' dangerouslySetInnerHTML={{ __html: row.original.pricing }} />
                )
            ),
        },
    ];

    let rows = [ /*{
        provider: Provider
        policies: []Policy,
        pricing:  string,
        platformDiscount: float,
    }*/ ];

    report.Policies.forEach(policy => {
        let row = rows.find(r => r.provider.Id === policy.PolicyProviderId);
        if (row) {
            if (!row.policies.includes(p => p.Id === policy.Id)) {
                row.policies.push(policy);
            }
        } else {
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
        let charges = report.ProviderCharges
            .filter(pc => pc.ProviderId === r.provider.Id);

        let cols = [{
            accessor: 'Desc',
            Header: 'Tier',
        }, {
            accessor: 'Charge',
            Header: 'Fee',
        }];

        let markup = ReactDOMServer.renderToStaticMarkup(
            <Table columns={cols} data={charges} />
        );

        let pricing = r.provider.Pricing.replace('{{ charges }}', markup);

        return {
            id:       ix++,
            provider: r.provider.Name,
            policies: r.policies.map(p => p.ExternalId).join(', '),
            pricing:  pricing,
        }
    });

    return (
        <>
            <br />
            <ModuleWrapper module={ModuleTypePolicyFees} />

            <Table columns={columns} data={tableRows} />
        </>
    );
}

export default PlatformFees;
