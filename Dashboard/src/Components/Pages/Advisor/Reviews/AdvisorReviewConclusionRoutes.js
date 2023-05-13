import React, { useContext } from 'react';

import ConclusionRoutesBase from 'Components/ReviewComponents/Conclusions/ConclusionRoutesBase';
import { Context } from 'State';
import { GetReport } from 'Components/ReviewComponents/GetReport';

const AdvisorReviewConclusionRoutes = () => {
    const [state,  ] = useContext(Context);
    let client = state.Metadata;

    let report = GetReport();

    let basePath = '/clients/id/:clientId/reviews/id/:reviewId/modules/:module';
    let baseTarget = `/clients/id/${client.Id}/reviews/id/${report.Id}/modules/assessments`;

    return (
        <ConclusionRoutesBase basePath   = {basePath}
                              baseTarget = {baseTarget} />
    );
}

export default AdvisorReviewConclusionRoutes;
