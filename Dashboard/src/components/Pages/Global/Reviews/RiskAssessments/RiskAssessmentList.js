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

const RiskAssessmentList = () => {
    let history = useHistory();
    const [ state, dispatch] = useContext(Context);

    const getRiskAssessments = useCallback(() => {
        Api.Global.RiskAssessments.Read(dispatch)
    }, [ dispatch ]);

    useEffect(() => {
        getRiskAssessments();
    }, [ getRiskAssessments ]);
    
    const onDelete = useCallback(params => async () => {
        if (window.confirm(`Delete riskAssessment?`)) {
            await Api.Global.RiskAssessments.Delete(params.row.id);
            await Api.Global.RiskAssessments.Read(dispatch);
        }        
    }, [ dispatch ]);

    const onEdit = useCallback(params => () => {
        let id = params.row.id;
        history.push(`/review-config/risk-assessment/id/${id}/edit`);
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

    let riskAssessments = state.RiskAssessments.map(p => {
        return {
            id:          p.Id,
            label:       p.Label,
            text:        p.Text,
        };
    });

    let data = {
        rows: riskAssessments,
        columns: columns,
    }

    return (
        <>
            <Toolbar className="breadcrumb-action">
                <Link to={{ pathname: '/review-config/risk-assessment/add' }}><Button>Add new Risk Assessment</Button></Link>
            </Toolbar>

            <DataGrid autoHeight {...data} />
        </>
    );
}

export default RiskAssessmentList;
