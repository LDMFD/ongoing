import React, { useContext, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import InventoryIcon from '@mui/icons-material/Inventory';

import Day from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { Context } from 'State/StateProvider'

const ReviewList = () => {
    Day.extend(utc);

    let history = useHistory();
    const [ state, ] = useContext(Context);

    const onEdit = useCallback(params => () => {
        history.push(`/client-space/reviews/${params.row.id}/modules/introduction`);
    }, [ history ]);

    const columns = [
        { field: 'startDateStr', headerName: 'Start date',   flex: 0.1, },
        { field: 'endDateStr',   headerName: 'End date',   flex: 0.1, },
        {
            field: 'actions',
            type: 'actions',
            flex: .1,
            getActions: (params) => [
                <GridActionsCellItem icon={<InventoryIcon />}   onClick={onEdit(params)}   label="Open" />,
            ]
        },
    ];

    let reviews = state.Reviews.map(review => {
        return {
            id:               review.Id,
            idLabel:          `#${review.Id}`,
            date:             review.Meta.FinalizedDate,
            startDateStr:     Day(review.Meta.StartDate).utc(false).format('DD-MM-YYYY'),
            endDateStr:       Day(review.Meta.EndDate).utc(false).format('DD-MM-YYYY'),
            finalizedDateStr: Day(review.Meta.FinalizedDate).utc(false).format('DD-MM-YYYY'),
            // state:      review.Meta.State,
        };
    }).sort((p,q) => (p.date < q.date) ? 1 : ((p.date > q.date) ? -1 : 0));

    let data = {
        rows: reviews,
        columns: columns,
    }

    return (
        <>
            <DataGrid autoHeight {...data} />
        </>
    );
}

export default ReviewList;
