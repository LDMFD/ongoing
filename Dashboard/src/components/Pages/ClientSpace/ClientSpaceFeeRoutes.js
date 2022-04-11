import React from 'react';

import FeeRoutesBase from 'Components/ReviewComponents/Fees/FeeRoutesBase';
import { GetReport } from 'Components/ReviewComponents/GetReport';

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
