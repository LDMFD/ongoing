 import {
    SET_RISKASSESSMENT_TEMPLATES
} from "State/Reducer";

const Create = (riskAssessment) => {
    return window.ApiClient.post(`advisor/reviews/risk-assessments`, {
        ...riskAssessment,
    });
}

const Read = (dispatch) => {
    return window.ApiClient.get(`advisor/reviews/risk-assessments`).then(res => {
        dispatch({
            type: SET_RISKASSESSMENT_TEMPLATES,
            payload: res.data,
        });
    });
}

const Update = (riskAssessment) => {
    return window.ApiClient.put(`advisor/reviews/risk-assessments/${riskAssessment.Id}`, {
        ...riskAssessment
    })
}

const Delete = (riskAssessmentId) => {
    return window.ApiClient.delete(`advisor/reviews/risk-assessments/${riskAssessmentId}`)
}

const defaults = {
    Create,
    Read,
    Update,
    Delete,
};
export default defaults;
