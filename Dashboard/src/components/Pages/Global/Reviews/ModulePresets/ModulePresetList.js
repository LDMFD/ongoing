import React, { useEffect, useContext, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import {
    Button,
    Toolbar,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { Context, Api } from 'State'
import { ModuleTypeSelectSpec } from 'State/ApiCommands/Global/Reviews/ModuleTypes';

const ModulePresetList = () => {
    let history = useHistory();
    const [ state, dispatch] = useContext(Context);

    const getModulePresets = useCallback(() => {
        Api.Global.Entities.Read(dispatch)
    }, [ dispatch ]);

    useEffect(() => {
        getModulePresets();
    }, [ getModulePresets ]);
    
    const onDelete = useCallback(params => async () => {
        if (window.confirm(`Delete modulePreset?`)) {
            await Api.Global.ModulePresets.Delete(params.row.id)
            await Api.Global.Entities.Read(dispatch);
        }        
    }, [ dispatch ]);

    const onEdit = useCallback(params => () => {
        let id = params.row.id;
        history.push(`/review-config/module-presets/id/${id}/edit`);
    }, [ history ]);

    const columns = [
        { field: 'moduleType', headerName: 'Module Type',     flex: 0.5, },
        { field: 'text',       headerName: 'Intro paragraph', flex: 0.5, },
        {
            field: 'actions',
            type: 'actions',
            flex: .01,
            getActions: (params) => [
                <GridActionsCellItem icon={<EditIcon />}   onClick={onEdit(params)}   label="Edit" />,
                <GridActionsCellItem icon={<DeleteIcon />} onClick={onDelete(params)} label="Delete" />,
            ]
        },
    ];

    let modulePresets = state.Entities.ModulePresets.map(p => {
        return {
            id:          p.Id,  // TODO multiple module presets?
            moduleType:  ModuleTypeSelectSpec.find(t => t.id === p.ModuleType).label,
            text:        p.Text,
        };
    });

    let data = {
        rows: modulePresets,
        columns: columns,
    }

    return (
        <>
            <Toolbar className="breadcrumb-action">
                <Link to={{ pathname: '/review-config/module-presets/add' }}><Button>Add new Module Preset</Button></Link>
            </Toolbar>

            <DataGrid autoHeight {...data} />
        </>
    );
}

export default ModulePresetList;
