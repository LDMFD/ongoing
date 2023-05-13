import { useContext } from 'react';
import { useParams } from "react-router-dom";

import { Context } from 'State';

// TODO merge these two

export const GetReport = () => {
    const [state,  ] = useContext(Context);

    let { reviewId } = useParams(),
       report;
    if (reviewId) {
        report = state.Reviews.find(r => r.Id === reviewId).Report;
    } else {
        report = state.Report;
    }
    return report;
}

export const GetMeta = () => {
    const [state,  ] = useContext(Context);

    let { reviewId } = useParams(),
       report;
    if (reviewId) {
        report = state.Reviews.find(r => r.Id === reviewId).Meta;
    } else {
        report = state.Draft;
    }
    return report;
}
