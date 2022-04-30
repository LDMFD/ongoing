import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import {
    Button,
    Toolbar,
} from '@mui/material';

import { Context } from 'State/StateProvider'
import { Api } from 'State';

const Publish = () => {
    let { clientId } = useParams();

    const [ state, dispatch ] = useContext(Context);

    const publishReview = async () => {
        await Api.Advisor.Reviews.Publish(clientId, state.Draft.Id);
        await Api.Advisor.ClientDetail.Read(dispatch, clientId);
    };

    return (
        <div>
            <br />

            <Toolbar className="breadcrumb-action">
                <Button onClick={publishReview}>Publish review</Button>
            </Toolbar>
        </div>
    );
}
export default Publish;
