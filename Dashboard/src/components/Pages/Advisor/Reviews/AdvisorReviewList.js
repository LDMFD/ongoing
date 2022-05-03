import React, { useContext, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import InventoryIcon from '@mui/icons-material/Inventory';
import DeleteIcon from '@mui/icons-material/Delete';

import Day from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { Context } from 'State/StateProvider'
import { Api } from 'State';

const ReviewList = () => {
    Day.extend(utc);

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
        { field: 'startDateStr',     headerName: 'Start Date',     flex: 0.1, },
        { field: 'endDateStr',       headerName: 'End Date',       flex: 0.1, },
        { field: 'finalizedDateStr', headerName: 'Finalised Date', flex: 0.1, },
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
            id:               review.Id,
            idLabel:          `#${review.Id}`,
            startDate:        review.Meta.StartDate,
            endDate:          review.Meta.EndDate,
            date:             review.Meta.FinalizedDate,
            startDateStr:     Day(review.Meta.StartDate).utc(false).format('DD-MM-YYYY'),
            endDateStr:       Day(review.Meta.EndDate).utc(false).format('DD-MM-YYYY'),
            finalizedDateStr: Day(review.Meta.FinalizedDate).format('DD-MM-YYYY'),
            // state:         review.Meta.State,
        };
    }).sort((p,q) => (p.date < q.date) ? 1 : ((p.date > q.date) ? -1 : 0));

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
