 import {
    SET_DILIGENCE_TEMPLATES
} from "State/Reducer";

const Create = (diligenceTemplate) => {
    return window.ApiClient.post(`advisor/reviews/diligence-templates`, {
        ...diligenceTemplate,
    });
}

const Read = (dispatch) => {
    return window.ApiClient.get(`advisor/reviews/diligence-templates`).then(res => {
        dispatch({
            type: SET_DILIGENCE_TEMPLATES,
            payload: res.data,
        });
    });
}

const Update = (diligenceTemplate) => {
    return window.ApiClient.put(`advisor/reviews/diligence-templates/${diligenceTemplate.Id}`, {
        ...diligenceTemplate
    })
}

const Delete = (diligenceTemplateId) => {
    return window.ApiClient.delete(`advisor/reviews/diligence-templates/${diligenceTemplateId}`)
}

const defaults = {
    Create,
    Read,
    Update,
    Delete,
};
export default defaults;
