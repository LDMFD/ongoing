import React, { useContext } from 'react';

import FeeRoutesBase from 'components/ReviewComponents/Fees/FeeRoutesBase';
import { Context } from 'State';
import { GetReport } from 'components/ReviewComponents/GetReport';

const AdvisorReviewFeeRoutes = () => {
    const [state,  ] = useContext(Context);
    let client = state.ClientContext;

    let report = GetReport();

    let basePath = '/clients/id/:clientId/reviews/id/:reviewId/modules/:module';
    let baseTarget = `/clients/id/${client.Id}/reviews/id/${report.Id}/modules/fees`;

    return (
        <FeeRoutesBase basePath   = {basePath}
                       baseTarget = {baseTarget} />
    );
}

export default AdvisorReviewFeeRoutes;
