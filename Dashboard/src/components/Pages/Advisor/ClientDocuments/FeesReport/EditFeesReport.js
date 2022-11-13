import React, { useContext, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Context } from 'State/StateProvider'
import FeesReportDialog from './FeesReportDialog';
import { GoBack } from 'Utils/Routing';
import { Api } from 'State';

const EditFeesReport = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch] = useContext(Context);
    let [ feesReport, setFeesReport ] = useState(null);

    let { feesReportId } = useParams();

    let client = state.Metadata;

    if (!feesReport) {
        setFeesReport(state.Report.FeesReports.find(h => h.Id === feesReportId))
        return;
    }
    const submitHandler = async (e) => {
        e.preventDefault();
        await Api.Advisor.FeesReports.Update(client.Id, feesReport)
        await Api.Advisor.ClientDetail.Read(dispatch, client.Id)
        goBack();
        return false;
    };

    return (
        <FeesReportDialog feesReport    = {feesReport}
                          setFeesReport = {setFeesReport}
                          submitLabel   = 'Update'
                          submitHandler = {submitHandler}  />
    );
}

export default EditFeesReport;
