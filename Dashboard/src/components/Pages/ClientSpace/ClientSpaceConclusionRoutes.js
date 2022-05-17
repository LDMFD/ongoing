import React from 'react';

import ConclusionRoutesBase from 'Components/ReviewComponents/Conclusions/ConclusionRoutesBase';
import { GetReport } from 'Components/ReviewComponents/GetReport';

const ConclusionRoutes = () => {
    let report = GetReport();

    let basePath = '/client-space/reviews/:reviewId/modules/:module';
    let baseTarget = `/client-space/reviews/${report.Id}/modules/assessments`;

    return (
        <ConclusionRoutesBase basePath   = {basePath}
                              baseTarget = {baseTarget} />
    );
}

export default ConclusionRoutes;
