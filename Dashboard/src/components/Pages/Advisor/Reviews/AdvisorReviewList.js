import React, { useContext, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import InventoryIcon from '@mui/icons-material/Inventory';
import DeleteIcon from '@mui/icons-material/Delete';

import { Context } from 'State/StateProvider'
import { Api } from 'State';
import { FromCanonical } from 'Utils/DateTime';

const ReviewList = () => {
    let history = useHistory();
    const [state, dispatch ] = useContext(Context);
    let {
        ClientContext: client,
    } = state;

    const onEdit = useCallback(params => () => {
        history.push(`/clients/id/${client.Id}/reviews/id/${params.row.id}/modules/introduction`);
    }, [ history, client.Id ]);

    const onDelete = useCallback(params => async () => {
        if (window.confirm(`Delete client review?`)) {
            await Api.Advisor.Reviews.Delete(client.Id, params.row.id)
            await Api.Advisor.ClientDetail.Read(dispatch, client.Id);
        }        
    }, [ dispatch, client.Id ]);

    const columns = [
        { field: 'startDate',     headerName: 'Start Date',     flex: 0.1, },
        { field: 'endDate',       headerName: 'End Date',       flex: 0.1, },
        { field: 'finalizedDate', headerName: 'Finalised Date', flex: 0.1, },
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

    let reviews = state.Reviews.map(review => {
        return {
            id:            review.Id,
            idLabel:       `#${review.Id}`,
            date:          review.Meta.FinalizedDate,
            startDate:     FromCanonical(review.Meta.StartDate)?.toLocaleDateString('en-GB'),
            endDate:       FromCanonical(review.Meta.EndDate)?.toLocaleDateString('en-GB'),
            finalizedDate: FromCanonical(review.Meta.FinalizedDate)?.toLocaleDateString('en-GB'),
            // state:         review.Meta.State,
        };
    }).sort((p,q) => (p.startDate < q.startDate) ? 1 : ((p.startDate > q.startDate) ? -1 : 0));

    let data = {
        rows: reviews,
        columns: columns,
    }

    return (
        <>
            <br />
            <DataGrid autoHeight {...data} />
        </>
    );
}

export default ReviewList;
