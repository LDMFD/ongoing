import React, { useContext } from 'react';
import { useParams } from "react-router-dom";

import FeeRoutesBase from 'components/ReviewComponents/Fees/FeeRoutesBase';
import { Context } from 'State';

const FeeRoutes = () => {
    const [state,  ] = useContext(Context);
    let client = state.ClientContext;

    let { reviewId } = useParams();
    reviewId = parseInt(reviewId);

    let basePath = '/clients/id/:clientId/reviews/id/:reviewId/modules/:module';
    let baseTarget = `/clients/id/${client.Id}/reviews/id/${reviewId}/modules/fees`;

    return (
        <FeeRoutesBase basePath   = {basePath}
                       baseTarget = {baseTarget} />
    );
}

export default FeeRoutes;
