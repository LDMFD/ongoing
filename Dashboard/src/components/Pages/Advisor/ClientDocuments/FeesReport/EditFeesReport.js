import React, { useContext } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Context } from 'State/StateProvider'
import FeesReportDialog from './FeesReportDialog';
import { GoBack } from 'Utils/Routing';
import { Api } from 'State';

const EditFeesReport = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch] = useContext(Context);

    let { feesReportId } = useParams();

    let client = state.Metadata;

    const submitHandler = async (feesReport) => {
        await Api.Advisor.FeesReports.Update(client.Id, feesReport)
        await Api.Advisor.ClientDetail.Read(dispatch, client.Id)
        goBack();
    };

    let feesReport = state.Report.FeesReports.find(h => h.Id === feesReportId);

    return (
        <FeesReportDialog feesReport    = {feesReport}
                          state         = {state}
                          submitLabel   = 'Update'
                          submitHandler = {submitHandler}  />
    );
}

export default EditFeesReport;
