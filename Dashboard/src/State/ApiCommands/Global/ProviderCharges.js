const Create = (providerCharge) => {
    return window.ApiClient.post(`advisor/provider-charges`, {
        ...providerCharge,
    });
}

const Update = (providerCharge) => {
    return window.ApiClient.put(`advisor/provider-charges/${providerCharge.Id}`, {
        ...providerCharge
    })
}

const Delete = (providerChargeId) => {
    return window.ApiClient.delete(`advisor/provider-charges/${providerChargeId}`)
}

const defaults = {
    Create,
    Update,
    Delete,
};
export default defaults;
