import React, { useContext, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import InventoryIcon from '@mui/icons-material/Inventory';
import Day from 'dayjs';

import { Context } from 'State/StateProvider'

const ReviewList = () => {
    let history = useHistory();
    const [ state, ] = useContext(Context);

    const onEdit = useCallback(params => () => {
        history.push(`/client-space/reviews/${params.row.id}/modules/introduction`);
    }, [ history ]);

    const columns = [
        { field: 'date',       headerName: 'Date',   flex: 0.1, },
        // { field: 'state',      headerName: 'State',  flex: 0.1, },
        {
            field: 'actions',
            type: 'actions',
            flex: .05,
            getActions: (params) => [
                <GridActionsCellItem icon={<InventoryIcon />}   onClick={onEdit(params)}   label="Open" />,
            ]
        },
    ];

    let reviews = state.Reviews.map(review => {
        return {
            id:         review.Id,
            idLabel:    `#${review.Id}`,
            date:       Day(review.Meta.FinalizedDate).format('DD-MM-YYYY'),
            // state:      review.Meta.State,
        };
    });

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
