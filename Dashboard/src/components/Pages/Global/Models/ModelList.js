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

const ModelList = () => {
    let history = useHistory();
    const [ state, dispatch] = useContext(Context);

    const getModels = useCallback(() => {
        Api.Global.Models.Read(dispatch)
    }, [ dispatch ]);

    useEffect(() => {
        getModels();
    }, [ getModels ]);
    
    const onDelete = useCallback(params => () => {
        if (window.confirm(`Delete model?`)) {
            window.ApiClient.delete(`advisor/models/${params.row.id}`)
            .then(async () => {
                await Api.Global.Models.Read(dispatch);
            });
        }        
    }, [ dispatch ]);

    const onEdit = useCallback(params => () => {
        let id = params.row.id;
        history.push(`/models/id/${id}/edit`);
    }, [ history ]);

    const columns = [
        { field: 'name',              headerName: 'Name',                 flex: 0.2, },
        { field: 'operator',          headerName: 'Operator',             flex: 0.2, },
        { field: 'weightedOcfFee',    headerName: 'Weighted OCF Fee',     flex: 0.1, },
        { field: 'weightedExAnteFee', headerName: 'Weighted Ex Ante Fee', flex: 0.1, },
        { field: 'file',              headerName: 'Factsheet',            flex: 0.2, },
        {
            field: 'actions',
            type: 'actions',
            flex: .1,
            getActions: (params) => [
                <GridActionsCellItem icon={<EditIcon />}   onClick={onEdit(params)}   label="Edit" />,
                <GridActionsCellItem icon={<DeleteIcon />} onClick={onDelete(params)} label="Delete" />,
            ]
        },
    ];

    let models = state.Models.map(m => {
        let op = state.Operators.find(o => o.Id === m.OperatorId).Name;
        return {
            id:                m.Id,
            name:              m.Name,
            operator:          op,
            weightedOcfFee:    m.WeightedOcfFee,
            weightedExAnteFee: m.WeightedExAnteFee,
            file:              m.File?.Filename,
        };
    });

    let data = {
        rows: models,
        columns: columns,
    }

    return (
        <>
            <Toolbar className="breadcrumb-action">
                <Link to={{ pathname: '/models/add' }}><Button>Add new model</Button></Link>
            </Toolbar>

            <DataGrid autoHeight {...data} />
        </>
    );
}

export default ModelList;
