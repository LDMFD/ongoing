const Throw = () => {
    return window.ApiClient.get(`user/errorcheck`);
}

const defaults = {
    Throw,
};
export default defaults;
