const Set = (clientId, options) => {
    return window.ApiClient.put(`advisor/clients/${clientId}/options`, {
        Options: JSON.stringify({
            ...options
        }),
    });
}

const Delete = (clientId) => {
    return window.ApiClient.put(`advisor/clients/${clientId}/options`, {
        Options: null,
    });
}

const defaults = {
    Set,
    Delete,
};
export default defaults;
