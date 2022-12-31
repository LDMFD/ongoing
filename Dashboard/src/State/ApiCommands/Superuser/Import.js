const Import = (fileId) => {
    return window.ApiClient.post(`admin/import`, {
        FileId: fileId,
    });
}
export default Import;
