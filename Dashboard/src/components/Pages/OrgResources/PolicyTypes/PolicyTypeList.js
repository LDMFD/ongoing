import React, { useContext, useCallback, useEffect } from 'react';

import { Context, Api } from 'State'
import Table from 'Components/Library/Table/Table';

const PolicyTypeList = () => {
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
        },
    ];

    let policyTypes = state.Resources.PolicyTypes.map(p => {
        return {
            id:       p.Id,
            name:     p.Name,
        };
    });

    return (
        <Table
            flexibleColumn = {1}
            columns        = {columns}
            data           = {policyTypes}
            resource       = 'policy-types'
            label          = 'Policy Type'
        />
    );
}

export default PolicyTypeList;
