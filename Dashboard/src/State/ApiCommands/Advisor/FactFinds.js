const Create = (clientId, assessment) => {
    return window.ApiClient.post(`advisor/clients/${clientId}/fact-finds`, {
        ...assessment,
    });
}

const Update = (clientId, assessment) => {
    return window.ApiClient.put(`advisor/clients/${clientId}/fact-finds/${assessment.Id}`, {
        ...assessment
    })
}

const Delete = (clientId, assessmentId) => {
    return window.ApiClient.delete(`advisor/clients/${clientId}/fact-finds/${assessmentId}`);
}

const defaults = {
    Create,
    Update,
    Delete,
};
export default defaults;
