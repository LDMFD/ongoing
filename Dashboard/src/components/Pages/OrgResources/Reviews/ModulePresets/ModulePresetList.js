import React, { useEffect, useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
    Button,
    Toolbar,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { Context, Api } from 'State'
import { ModuleTypeSelectSpec } from 'State/ApiCommands/OrgResources/Reviews/ModuleTypes';
import Table from 'Components/Library/Table/Table';
import IconGroup from 'Components/Library/IconGroup/IconGroup';

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
            accessor: 'label',
            Header: 'Module Type',
            width: 1.2,
        },
        {
            accessor: 'text',
            Header: 'Module Preset',
            width: 3,
            Cell: ({ row }) => (
                <div className='ong-notes' dangerouslySetInnerHTML={{ __html: row.original.text }} />
            )
        },
        {
            accessor: 'actions',
            width: .7,
            Cell: ({ row }) => (
                <IconGroup>
                    <Link to={`/review-config/module-presets/id/${row.original.type}/delete`}>
                        <DeleteIcon />
                    </Link>
                    <Link to={`/review-config/module-presets/id/${row.original.type}/edit`}>
                        <EditIcon />
                    </Link>
                </IconGroup>
            ),
        },
    ];

    let modulePresets = state.Resources.ModulePresets.map(p => {
        return {
            // TODO multiple entries per module presets?
            type:  ModuleTypeSelectSpec.find(t => t.id === p.ModuleType).id,
            label:  ModuleTypeSelectSpec.find(t => t.id === p.ModuleType).label,
            text:  p.Text,
        };
    });

    return (
        <>
            <Toolbar className="breadcrumb-action">
                <Link to={{ pathname: '/review-config/module-presets/add' }}><Button>Add new Module Preset</Button></Link>
            </Toolbar>

            <Table columns={columns} data={modulePresets} />
        </>
    );
}

export default ModulePresetList;
