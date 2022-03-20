import React, { useContext, useState } from 'react';

import './Module.css';
import { Context } from 'State/StateProvider'
import { DefaultModule } from './DefaultModule';

export const Module = ({ module }) => {
    const [ state,  ] = useContext(Context);

    let [ moduleState, setModuleState ] = useState(null);
    let preset;

    // let client = state.Clients[0];
    let client = state.ClientContext;
    let review = client.Reviews[0];
    let draft = review?.Modules?.find(m => m.Type === module);

    preset = state.ModulePresets.find(p => p.ModuleType === module);

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
