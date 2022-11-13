const Create = (riskLevel) => {
    return window.ApiClient.post(`advisor/risk-levels`, {
        ...riskLevel,
    });
}

const Update = (riskLevel) => {
    return window.ApiClient.put(`advisor/risk-levels/${riskLevel.Id}`, {
        ...riskLevel
    })
}

const Delete = (riskLevelId) => {
    return window.ApiClient.delete(`advisor/risk-levels/${riskLevelId}`)
}

const defaults = {
    Create,
    Update,
    Delete,
};
export default defaults;
