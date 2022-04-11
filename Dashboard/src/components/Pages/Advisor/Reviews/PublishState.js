import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import {
    Button,
    Toolbar,
} from '@mui/material';

import { GetReport } from 'Components/ReviewComponents/GetReport';
import { Context } from 'State';

const PublishState = () => {
    const [ state, ] = useContext(Context);
    let { ClientContext: client } = state;
    let report = GetReport();

    return (
        <>
            {/* State: {review.Meta.State} */}

            <Toolbar className="breadcrumb-action">
                <Link to={{ pathname: `/clients/id/${client.Id}/reviews/id/${report.Id}/modules/state/edit` }}><Button>Edit state</Button></Link>
            </Toolbar>

            retract, etc.
        </>
    );
}

export default PublishState;
