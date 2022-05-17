import React, { useContext } from 'react';

import ConclusionRoutesBase from 'Components/ReviewComponents/Conclusions/ConclusionRoutesBase';
import { Context } from 'State';

const ReportConclusionRoutes = () => {
    const [ state, ] = useContext(Context);
    let client = state.ClientContext;

    let basePath = '/clients/id/:clientId/modules/:module';
    let baseTarget = `/clients/id/${client.Id}/modules/assessments`;

    return (
        <ConclusionRoutesBase basePath   = {basePath}
                              baseTarget = {baseTarget} />
    );
}

export default ReportConclusionRoutes;
