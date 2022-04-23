import React from 'react';

import ProfileRoutesBase from 'Components/ReviewComponents/Profile/ProfileRoutesBase';
import { GetReport } from 'Components/ReviewComponents/GetReport';

const ProfileRoutes = () => {
    let report = GetReport();

    let basePath = '/client-space/reviews/:reviewId/modules/:module';
    let baseTarget = `/client-space/reviews/${report.Id}/modules/profile`;

    return (
        <ProfileRoutesBase basePath   = {basePath}
                           baseTarget = {baseTarget} />
    );
}

export default ProfileRoutes;
