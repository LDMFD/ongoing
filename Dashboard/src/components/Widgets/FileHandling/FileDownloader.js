export const Download = (uid) => {
    window.ApiClient.get(`advisor/storage/download?Uid=${uid}`).then(res => {
        window.location = res.data.Url;
    })
};
