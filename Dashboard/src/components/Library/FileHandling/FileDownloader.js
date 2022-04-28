export const Download = (uid) => {
    window.ApiClient.get(`/common/storage/download?Uid=${uid}`).then(res => {
        window.location = res.data.Url;
    })
};
