import React, { useContext, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import InventoryIcon from '@mui/icons-material/Inventory';

import { Context } from 'State/StateProvider'
import { FromCanonical } from 'Utils/DateTime';

const ReviewList = () => {
    let history = useHistory();
    const [ state, ] = useContext(Context);

    const onEdit = useCallback(params => () => {
        history.push(`/client-space/reviews/${params.row.id}/modules/introduction`);
    }, [ history ]);

    const columns = [
        { field: 'ix',        headerName: '#',            flex: 0.1, },
        { field: 'startDate', headerName: 'Start date',   flex: 0.1, },
        { field: 'endDate',   headerName: 'End date',   flex: 0.1, },
        {
            field: 'actions',
            type: 'actions',
            flex: .1,
            getActions: (params) => [
                <GridActionsCellItem icon={<InventoryIcon />}   onClick={onEdit(params)}   label="Open" />,
            ]
        },
    ];

    let ix = 1;
    let reviews = state.Reviews.map(review => {
        return {
            id:               review.Id,
            ix:            ix++,
            idLabel:          `#${review.Id}`,
            date:             review.Meta.FinalizedDate,
            startDate:        FromCanonical(review.Meta.StartDate)?.toLocaleDateString('en-GB'),
            endDate:          FromCanonical(review.Meta.EndDate)?.toLocaleDateString('en-GB'),
            // no finalizedDate
            // state:      review.Meta.State,
        };
    }).sort((p,q) => (p.ix < q.ix) ? 1 : ((p.ix > q.ix) ? -1 : 0));

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
