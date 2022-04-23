const Create = (clientId, assessment) => {
    return window.ApiClient.post(`advisor/clients/${clientId}/risk-assessments`, {
        ...assessment,
    });
}

const Update = (clientId, assessment) => {
    return window.ApiClient.put(`advisor/clients/${clientId}/risk-assessments/${assessment.Id}`, {
        ...assessment
    })
}

const Delete = (clientId, assessmentId) => {
    return window.ApiClient.delete(`advisor/clients/${clientId}/risk-assessments/${assessmentId}`);
}

const defaults = {
    Create,
    Update,
    Delete,
};
export default defaults;
