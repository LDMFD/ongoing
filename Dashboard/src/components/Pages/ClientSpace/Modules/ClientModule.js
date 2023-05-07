import React, { useContext, useState } from 'react';
import { useParams } from "react-router-dom";

import './ClientModule.css';
import { Context } from 'State/StateProvider'
import { DefaultModule } from './DefaultModule';
import Panel from 'Components/Library/Panel/Panel';

export const ClientModule = ({ module }) => {
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

    return (intro.length || moduleState.Text.length) ? (
        <Panel>
            <div dangerouslySetInnerHTML={{ __html: intro }} />

            {moduleState.Text &&
                <div dangerouslySetInnerHTML={{ __html: moduleState.Text }} />
            }
        </Panel>
    ) : null;
}
