import React, { useContext, useCallback, useEffect } from 'react';

import { Api, Context } from 'State'
import Table from 'Components/Library/Table/Table';

import './Platforms.css';

const PolicyProviderList = () => {
    const [ state, dispatch ] = useContext(Context);

    const sync = useCallback(() => {
        Api.OrgResources.Entities.Read(dispatch)
    }, [ dispatch ]);

    useEffect(() => {
        sync();
    }, [ sync ]);

    const columns = [
        {
            id: 'name',
            header: 'Name',
            width: 200,
        }, {
            id: 'pricing',
            header: 'Pricing',
            Cell: ({ row }) => (
                row.original.pricing && (
                    <div className='ong-notes' dangerouslySetInnerHTML={{ __html: row.original.pricing }} />
                )
            ),
        }, {
            id: 'customPricing',
            header: 'Custom Pricing',
            Cell: ({ row }) => (
                row.original.pricing && (
                    <div className='ong-notes' dangerouslySetInnerHTML={{ __html: row.original.customPricing }} />
                )
            ),
        },
    ];

    let policyProviders = state.Resources.PolicyProviders.map(p => {
        return {
            id:            p.Id,
            name:          p.Name,
            pricing:       p.Pricing,
            customPricing: p.CustomPricing,
        };
    });

    return (
        <div className='ong-platforms'>
            <Table
                columns     = {columns}
                data        = {policyProviders}
                resource    = 'platforms'
                label       = 'Platform'
                customRowActions = {[
                    {
                        label: 'Edit text',
                        link: (id) => `/platforms/id/${id}/edit`,
                    },
                    {
                        label: 'Edit charges',
                        link: (id) => `/platforms/id/${id}/provider-charges`,
                    },
                    {
                        label: 'Delete',
                        link: (id) => `/platforms/id/${id}/delete`,
                    },
                ]}
            />
        </div>
    );
}

export default PolicyProviderList;
