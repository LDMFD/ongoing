import React, { useEffect, useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
    Button,
    Toolbar,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { Context, Api } from 'State'
import { ModuleTypeSelectSpec } from 'State/ApiCommands/Global/Reviews/ModuleTypes';
import Table from 'Components/Widgets/Table';
import IconGroup from 'Components/Widgets/IconGroup';

const ModulePresetList = () => {
    const [ state, dispatch] = useContext(Context);

    const getModulePresets = useCallback(() => {
        Api.Global.Entities.Read(dispatch)
    }, [ dispatch ]);

    useEffect(() => {
        getModulePresets();
    }, [ getModulePresets ]);
    
    const columns = [
        {
            accessor: 'moduleType',
            Header: 'Module Type',
            width: 1,
        },
        {
            accessor: 'text',
            Header: 'Intro paragraph',
            width: 1,
        },
        {
            accessor: 'actions',
            width: .2,
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

    let modulePresets = state.Entities.ModulePresets.map(p => {
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
