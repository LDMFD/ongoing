import React, { useContext } from 'react';

import ProfileRoutesBase from 'Components/ReviewComponents/Profile/ProfileRoutesBase';
import { Context } from 'State';

const ReportProfileRoutes = () => {
    const [state,  ] = useContext(Context);
    let client = state.Metadata;

    let basePath = '/clients/id/:clientId/modules/:module';
    let baseTarget = `/clients/id/${client.Id}/modules/profile`;

    return (
        <ProfileRoutesBase basePath   = {basePath}
                           baseTarget = {baseTarget} />
    );
}

export default ReportProfileRoutes;
