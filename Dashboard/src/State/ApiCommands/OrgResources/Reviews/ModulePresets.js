const Create = (modulePreset) => {
    return window.ApiClient.post(`advisor/reviews/module-presets`, {
        ...modulePreset,
    });
}

const Update = (modulePreset) => {
    return window.ApiClient.put(`advisor/reviews/module-presets/${modulePreset.ModuleType}`, {
        ...modulePreset
    })
}

const Delete = (modulePresetId) => {
    return window.ApiClient.delete(`advisor/reviews/module-presets/${modulePresetId}`)
}

const defaults = {
    Create,
    Update,
    Delete,
};
export default defaults;
