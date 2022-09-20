export const Download = (uid) => {
    window.ApiClient.get(`storage/files?Uid=${uid}`).then(res => {
        window.location = res.data.Url;
    })
};
