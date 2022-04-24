const Create = (clientId, feesReport) => {
    return window.ApiClient.post(`advisor/clients/${clientId}/fees-reports`, {
        ...feesReport,
    });
}

const Update = (clientId, feesReport) => {
    return window.ApiClient.put(`advisor/clients/${clientId}/fees-reports/${feesReport.Id}`, {
        ...feesReport
    })
}

const Delete = (clientId, feesReportId) => {
    return window.ApiClient.delete(`advisor/clients/${clientId}/fees-reports/${feesReportId}`);
}

const defaults = {
    Create,
    Update,
    Delete,
};
export default defaults;
