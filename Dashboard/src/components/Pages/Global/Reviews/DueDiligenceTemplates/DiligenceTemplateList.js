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

const DiligenceTemplateList = () => {
    let history = useHistory();
    const [ state, dispatch] = useContext(Context);

    const getDiligenceTemplates = useCallback(() => {
        Api.Global.DiligenceTemplates.Read(dispatch)
    }, [ dispatch ]);

    useEffect(() => {
        getDiligenceTemplates();
    }, [ getDiligenceTemplates ]);
    
    const onDelete = useCallback(params => async () => {
        if (window.confirm(`Delete diligenceTemplate?`)) {
            await Api.Global.DiligenceTemplates.Delete(params.row.id);
            await Api.Global.DiligenceTemplates.Read(dispatch);
        }        
    }, [ dispatch ]);

    const onEdit = useCallback(params => () => {
        let id = params.row.id;
        history.push(`/review-config/due-diligence/id/${id}/edit`);
    }, [ history ]);

    const columns = [
        { field: 'label', headerName: 'Select menu label', flex: 0.5, },
        { field: 'text',  headerName: 'Template',  flex: 0.5, },
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

    let diligenceTemplates = state.DiligenceTemplates.map(p => {
        return {
            id:          p.Id,
            label:       p.Label,
            text:        p.Text,
        };
    });

    let data = {
        rows: diligenceTemplates,
        columns: columns,
    }

    return (
        <>
            <Toolbar className="breadcrumb-action">
                <Link to={{ pathname: '/review-config/due-diligence/add' }}><Button>Add new Due Diligence template</Button></Link>
            </Toolbar>

            <DataGrid autoHeight {...data} />
        </>
    );
}

export default DiligenceTemplateList;
