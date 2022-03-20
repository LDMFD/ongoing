import React, { useContext, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import InventoryIcon from '@mui/icons-material/Inventory';

import { Context } from 'State/StateProvider'

const ReviewList = () => {
    let history = useHistory();
    const [ state, ] = useContext(Context);

    let client = state.ClientContext;

    const onEdit = useCallback(params => () => {
        history.push(`/client-space/reviews/${params.row.id}/modules/introduction`);
    }, [ history ]);

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
            <DataGrid autoHeight {...data} />
        </>
    );
}

export default ReviewList;
