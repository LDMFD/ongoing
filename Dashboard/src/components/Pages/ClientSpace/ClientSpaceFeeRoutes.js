import React from 'react';
import { useParams } from "react-router-dom";

import FeeRoutesBase from 'components/ReviewComponents/Fees/FeeRoutesBase';

const FeeRoutes = () => {
    let { reviewId } = useParams();
    reviewId = parseInt(reviewId);

    let basePath = '/client-space/reviews/:reviewId/modules/:module';
    let baseTarget = `/client-space/reviews/${reviewId}/modules/fees`;

    return (
        <FeeRoutesBase basePath   = {basePath}
                       baseTarget = {baseTarget} />
    );
}

export default FeeRoutes;
