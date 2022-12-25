import React, { useContext } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Context } from 'State/StateProvider'
import { DefaultFeesReport } from './DefaultFeesReport';
import FeesReportDialog from './FeesReportDialog';
import { GoBack } from 'Utils/Routing';
import { Api } from 'State';

const AddFeesReport = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch] = useContext(Context);

    let { clientId } = useParams();

    const submitHandler = async (feesReport) => {
        await Api.Advisor.FeesReports.Create(clientId, feesReport);
        await Api.Advisor.ClientDetail.Read(dispatch, clientId);
        goBack();
    };
    
    return (
        <FeesReportDialog feesReport    = {DefaultFeesReport}
                          state         = {state}
                          submitLabel   = 'Add'
                          submitHandler = {submitHandler}  />
    );
}

export default AddFeesReport;
