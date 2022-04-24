import React, { useContext, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Context } from 'State/StateProvider'
import { DefaultFeesReport } from './DefaultFeesReport';
import FeesReportDialog from './FeesReportDialog';
import { GoBack } from 'Utils/Routing';
import { Api } from 'State';

const AddFeesReport = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [, dispatch] = useContext(Context);
    let [ feesReport, setFeesReport ] = useState(DefaultFeesReport);

    let { clientId } = useParams();

    const submitHandler = async (e) => {
        e.preventDefault();
        await Api.Advisor.FeesReports.Create(clientId, feesReport);
        await Api.Advisor.ClientDetail.Read(dispatch, clientId);
        goBack();
        return false;
    };
    
    return (
        <FeesReportDialog feesReport    = {feesReport}
                          setFeesReport = {setFeesReport}
                          submitLabel   = 'Add'
                          submitHandler = {submitHandler}  />
    );
}

export default AddFeesReport;
