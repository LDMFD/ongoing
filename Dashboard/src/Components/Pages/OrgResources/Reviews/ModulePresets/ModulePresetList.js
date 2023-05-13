import React, { useEffect, useContext, useCallback } from 'react';

import { Context, Api } from 'State'
import { ModuleTypeSelectSpec } from 'State/ApiCommands/OrgResources/Reviews/ModuleTypes';
import Table from 'Components/Library/Table/Table';

const ModulePresetList = () => {
    const [ state, dispatch] = useContext(Context);

    const sync = useCallback(() => {
        Api.OrgResources.Entities.Read(dispatch)
    }, [ dispatch ]);

    useEffect(() => {
        sync();
    }, [ sync ]);
    
    const columns = [
        {
            id: 'label',
            header: 'Module Type',
            width: 300,
        },
        {
            id: 'text',
            header: 'Module Preset',
            Cell: ({ row }) => (
                <div className='ong-notes' dangerouslySetInnerHTML={{ __html: row.original.text }} />
            )
        },
    ];

    let modulePresets = state.Resources.ModulePresets.map(p => {
        return {
            // TODO multiple entries per module presets?
            id:  ModuleTypeSelectSpec.find(t => t.id === p.ModuleType).id,
            label:  ModuleTypeSelectSpec.find(t => t.id === p.ModuleType).label,
            text:  p.Text,
        };
    });

    return (
        <Table
            flexibleColumn = {2}
            columns        = {columns}
            data           = {modulePresets}
            resource       = 'review-config/module-presets'
            label          = 'Module Preset'
        />
    );
}

export default ModulePresetList;
