import React, { useContext } from 'react';

import { Context } from 'State'
import Table from 'Components/Library/Table/Table';

const RiskProviderList = () => {
    const [ state ] = useContext(Context);

    const columns = [
        {
            id: 'name',
            header: 'Name',
        },
    ];

    let riskProviders = state.Resources.RiskProviders.map(p => {
        return {
            id:       p.Id,
            name:     p.Name,
        };
    });

    return (
        <Table
            flexibleColumn = {1}
            columns     = {columns}
            data        = {riskProviders}
            resource    = 'risk-providers'
            label       = 'Risk Provider'
            customRowActions = {[
                {
                    label: 'Edit name',
                    link: (id) => `/risk-providers/id/${id}/edit`,
                },
                {
                    label: 'Edit levels',
                    link: (id) => `/risk-providers/id/${id}/risk-levels`,
                },
                {
                    label: 'Delete',
                    link: (id) => `/risk-providers/id/${id}/delete`,
                },
            ]}
    />
    );
}

export default RiskProviderList;
