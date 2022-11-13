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

    const getModulePresets = useCallback(() => {
        Api.OrgResources.Entities.Read(dispatch)
    }, [ dispatch ]);

    useEffect(() => {
        getModulePresets();
    }, [ getModulePresets ]);
    
    const columns = [
        {
            accessor: 'moduleType',
            Header: 'Module Type',
            width: 2,
        },
        {
            accessor: 'text',
            Header: 'Module Preset',
            width: 5,
            Cell: ({ row }) => (
                <div className='ong-notes' dangerouslySetInnerHTML={{ __html: row.original.text }} />
            )
        },
        {
            accessor: 'actions',
            width: 1,
            Cell: ({ row }) => (
                <IconGroup>
                    <Link to={`/review-config/module-presets/id/${row.original.id}/delete`}>
                        <DeleteIcon />
                    </Link>
                    <Link to={`/review-config/module-presets/id/${row.original.id}/edit`}>
                        <EditIcon />
                    </Link>
                </IconGroup>
            ),
        },
    ];

    let modulePresets = state.Resources.ModulePresets.map(p => {
        return {
            id:          p.Id,  // TODO multiple module presets?
            moduleType:  ModuleTypeSelectSpec.find(t => t.id === p.ModuleType).label,
            text:        p.Text,
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
