import React, { useContext } from 'react';

import ProfileRoutesBase from 'Components/ReviewComponents/Profile/ProfileRoutesBase';
import { Context } from 'State';
import { GetReport } from 'Components/ReviewComponents/GetReport';

const AdvisorReviewProfileRoutes = () => {
    const [state,  ] = useContext(Context);
    let client = state.Metadata;

    let report = GetReport();

    let basePath = '/clients/id/:clientId/reviews/id/:reviewId/modules/:module';
    let baseTarget = `/clients/id/${client.Id}/reviews/id/${report.Id}/modules/profile`;

    return (
        <ProfileRoutesBase basePath   = {basePath}
                           baseTarget = {baseTarget} />
    );
}

export default AdvisorReviewProfileRoutes;
