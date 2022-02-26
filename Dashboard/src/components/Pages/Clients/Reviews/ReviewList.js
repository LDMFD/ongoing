import React, { useContext, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import {
    Button,
    Toolbar,
} from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import DeleteIcon from '@mui/icons-material/Delete';

import { Context } from 'State/StateProvider'
import { Api } from 'State';

const ReviewList = () => {
    let history = useHistory();
    const [ state, dispatch] = useContext(Context);

    let { clientId } = useParams();
    clientId = parseInt(clientId);

    let client = state.Clients.find(c => c.Id === clientId);

    const addReview = async () => {
        await Api.Clients.Reviews.Create(clientId);
        await Api.Clients.ClientDetail.Read(dispatch, clientId);
    };

    const onEdit = useCallback(params => () => {
        history.push(`/clients/id/${clientId}/reviews/id/${params.row.id}/modules/introduction`);
    }, [ history, clientId ]);

    const onDelete = useCallback(params => async () => {
        if (window.confirm(`Delete client review?`)) {
            await Api.Clients.Reviews.Delete(clientId, params.row.id)
            await Api.Clients.ClientDetail.Read(dispatch, clientId);
        }        
    }, [ dispatch, clientId ]);

    const columns = [
        { field: 'idLabel',    headerName: 'ID',     flex: 0.1, },
        { field: 'date',       headerName: 'Date',   flex: 0.1, },
        { field: 'state',      headerName: 'State',  flex: 0.1, },
        {
            field: 'actions',
            type: 'actions',
            flex: .05,
            getActions: (params) => [
                <GridActionsCellItem icon={<InventoryIcon />}   onClick={onEdit(params)}   label="Open" />,
                <GridActionsCellItem icon={<DeleteIcon />}      onClick={onDelete(params)} label="Delete" />,
            ]
        },
    ];

    let reviews = client.Reviews.map(review => {
        return {
            id:         review.Id,
            idLabel:    `#${review.Id}`,
            date:       review.Timestamp,
            state:      review.State,
        };
    });

    let data = {
        rows: reviews,
        columns: columns,
    }

    return (
        <>
            <Toolbar className="breadcrumb-action">
                <Button onClick={addReview}>Add review</Button>
            </Toolbar>

            <DataGrid autoHeight {...data} />
        </>
    );
}

export default ReviewList;
