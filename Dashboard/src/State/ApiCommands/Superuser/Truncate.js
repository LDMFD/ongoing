const Truncate = (env) => {
    return window.ApiClient.post(`admin/truncate`, {
        Env: env,
    });
}
export default Truncate;
