import React, { useContext } from 'react';

import FeeRoutesBase from 'components/ReviewComponents/Fees/FeeRoutesBase';
import { Context } from 'State';

const ReportFeeRoutes = () => {
    const [state,  ] = useContext(Context);
    let client = state.ClientContext;

    let basePath = '/clients/id/:clientId/modules/:module';
    let baseTarget = `/clients/id/${client.Id}/modules/fees`;

    return (
        <FeeRoutesBase basePath   = {basePath}
                       baseTarget = {baseTarget} />
    );
}

export default ReportFeeRoutes;
