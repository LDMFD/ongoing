import React, { useContext, useState } from 'react';
import { useParams } from "react-router-dom";

import './ClientModule.css';
import { Context } from 'State/StateProvider'
import { DefaultModule } from './DefaultModule';
import Panel from 'Components/Library/Panel/Panel';
// import PageTitle from 'Components/Library/PageTitle/PageTitle';
// import { ModuleTypeSelectSpec } from 'State/ApiCommands/OrgResources/Reviews/ModuleTypes';
// import { FromCanonical } from 'Utils/DateTime';

export const ClientModule = ({ module }) => {
    // let { clientId } = useParams();

    const [ state,  ] = useContext(Context);

    let { reviewId } = useParams();
    let review = state.Reviews.find(r => r.Id === reviewId).Report;

    let [ moduleState, setModuleState ] = useState(null);
    let preset;

    let draft = review.Modules.find(m => m.Type === module);

    preset = review.ModulePresets.find(p => p.ModuleType === module);

    if (!moduleState || reviewId !== moduleState.ReviewId) {
        // First load
        if (draft) {
            setModuleState({
                ...draft,
                ReviewId: reviewId,
            });
        } else {
            setModuleState({
                ...DefaultModule,
                Type: module,
                ReviewId: reviewId,
            });
        }
        return;
    }

    let intro = moduleState.Intro;
    if (!intro && preset) {
        intro = preset.Text;
    }

    // let type = ModuleTypeSelectSpec.find(t => t.id === module);
    // let endDate = FromCanonical(state.Reviews.find(r => r.Id == reviewId).Meta.EndDate)

    return (intro.length || moduleState.Text.length) ? (
        <Panel>
            {/* <PageTitle title={`Review (${endDate}) - ${type.label} | ${state.Metadata.Identity.Forenames} ${state.Metadata.Identity.Surname} | Amplifa`} /> */}

            <div dangerouslySetInnerHTML={{ __html: intro }} />

            {moduleState.Text &&
                <div dangerouslySetInnerHTML={{ __html: moduleState.Text }} />
            }
        </Panel>
    ) : null;
}
