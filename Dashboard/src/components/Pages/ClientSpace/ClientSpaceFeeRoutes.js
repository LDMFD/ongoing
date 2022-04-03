import React from 'react';

import FeeRoutesBase from 'components/ReviewComponents/Fees/FeeRoutesBase';
import { GetReport } from 'components/ReviewComponents/GetReport';

const FeeRoutes = () => {
    let report = GetReport();

    let basePath = '/client-space/reviews/:reviewId/modules/:module';
    let baseTarget = `/client-space/reviews/${report.Id}/modules/fees`;

    return (
        <FeeRoutesBase basePath   = {basePath}
                       baseTarget = {baseTarget} />
    );
}

export default FeeRoutes;
