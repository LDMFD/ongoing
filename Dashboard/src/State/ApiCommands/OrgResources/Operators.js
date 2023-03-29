const Create = (operators) => {
    return window.ApiClient.post(`advisor/operators`, {
        ...operators,
    });
}

const Update = (operators) => {
    return window.ApiClient.put(`advisor/operators/${operators.Id}`, {
        ...operators
    })
}

const Delete = (operatorId, execute) => {
    return window.ApiClient.delete(`advisor/operators/${operatorId}?execute=${execute}`)
}

const defaults = {
    Create,
    Update,
    Delete,
};
export default defaults;
