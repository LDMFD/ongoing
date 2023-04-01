import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {
    Button,
    Toolbar,
} from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import DeleteIcon from '@mui/icons-material/Delete';

import { Api } from 'State';
import { Context } from 'State/StateProvider'
import { FromCanonical } from 'Utils/DateTime';
import IconGroup from 'Components/Library/IconGroup/IconGroup';
import Table from 'Components/Library/Table/Table';

const AdvisorReviewList = () => {
    const [ state, dispatch ] = useContext(Context);
    let {
        Metadata: client,
    } = state;

    let { clientId } = useParams();

    const publishReview = async () => {
        await Api.Advisor.Reviews.Publish(clientId, state.Draft.Id);
        await Api.Advisor.ClientDetail.Read(dispatch, clientId);
    };

    const columns = [{
        accessor: 'startDate',
        Header: 'Review period start', 
    }, {
        accessor: 'endDate',
        Header: 'Review period end', 
    }, {
        accessor: 'finalizedDate',
        Header: 'Time of publish', 
    }, {
        accessor: 'actions',
        Header: '',
        Cell: ({ row }) => (
            <IconGroup>
                <Link to={`/clients/id/${client.Id}/reviews/id/${row.original.id}/modules/introduction`}>
                    <InventoryIcon />
                </Link>
                <Link to={`/clients/id/${client.Id}/reviews/delete/${row.original.id}`}>
                    <DeleteIcon />
                </Link>
            </IconGroup>
        ),
    }];

    let ix = 1;
    let reviews = state.Reviews.map(review => {
        return {
            id:            review.Id,
            ix:            ix++,
            idLabel:       `#${review.Id}`,
            date:          review.Meta.FinalizedDate,
            startDate:     FromCanonical(review.Meta.StartDate)?.toLocaleDateString('en-GB'),
            endDate:       FromCanonical(review.Meta.EndDate)?.toLocaleDateString('en-GB'),
            finalizedDate: FromCanonical(review.Meta.FinalizedDate)?.toLocaleString('en-GB'),
            // state:         review.Meta.State,
        };
    }).sort((p,q) => (p.ix < q.ix) ? 1 : ((p.ix > q.ix) ? -1 : 0));

    return (
        <>
            <Toolbar className="breadcrumb-action">
                <Button onClick={publishReview}>Publish review</Button>
            </Toolbar>

            <br />

            {reviews.length ?
                <Table columns={columns} data={reviews} />
            :
                <p>
                    No reviews - press publish to create a new review.
                </p>
            }
        </>
    );
}

export default AdvisorReviewList;
