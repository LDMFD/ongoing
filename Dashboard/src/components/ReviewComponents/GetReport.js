import { useContext } from 'react';
import { useParams } from "react-router-dom";

import { Context } from 'State';

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
