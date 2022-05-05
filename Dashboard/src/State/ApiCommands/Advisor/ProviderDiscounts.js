const Create = (clientId, providerDiscount) => {
    return window.ApiClient.post(`advisor/clients/${clientId}/provider-discounts`, {
        ...providerDiscount,
    });
}

const Update = (clientId, providerDiscount) => {
    return window.ApiClient.put(`advisor/clients/${clientId}/provider-discounts/${providerDiscount.Id}`, {
        ...providerDiscount
    })
}

const Delete = (clientId, providerDiscountId) => {
    return window.ApiClient.delete(`advisor/clients/${clientId}/provider-discounts/${providerDiscountId}`);
}

const defaults = {
    Create,
    Update,
    Delete,
};
export default defaults;
