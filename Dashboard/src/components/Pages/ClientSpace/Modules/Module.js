import React, { useContext, useState } from 'react';
import { useParams } from "react-router-dom";

import './Module.css';
import { Context } from 'State/StateProvider'
import { DefaultModule } from './DefaultModule';

export const Module = ({ module }) => {
    const [ state,  ] = useContext(Context);

    let { reviewId } = useParams();
    let review = state.Reviews.find(r => r.Id === reviewId).Report;

    let [ moduleState, setModuleState ] = useState(null);
    let preset;

    let draft = review.Modules.find(m => m.Type === module);

    preset = review.ModulePresets.find(p => p.ModuleType === module);

    if (!moduleState) {
        // First load
        if (draft) {
            setModuleState(draft);
        } else {
            setModuleState({
                ...DefaultModule,
                Type: module,
            });
        }
        return;
    }

    let intro = moduleState.Intro;
    if (!intro && preset) {
        intro = preset.Text;
    }

    return (
        <>
            <br />
            <div dangerouslySetInnerHTML={{ __html: intro }} />

            {moduleState.Text &&
                <div dangerouslySetInnerHTML={{ __html: moduleState.Text }} />
            }
        </>
    );
}
