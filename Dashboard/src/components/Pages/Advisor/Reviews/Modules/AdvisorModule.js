import { useContext, useState } from 'react';
import {
    Card,
    CardContent,
    CardHeader
} from '@mui/material';

import './AdvisorModule.css';
import { Context } from 'State/StateProvider';
import { DefaultModule } from './DefaultModule';
import Dropdown from 'Components/Library/Dropdown/Dropdown';

export const AdvisorModule = ({ module }) => {
    const [ state,  ] = useContext(Context);

    let [ moduleState, setModuleState ] = useState(null);
    let preset;

    let draft = state.Report.Modules.find(m => m.Type === module);

    preset = state.Report.ModulePresets.find(p => p.ModuleType === module);

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
    } else if (draft && (moduleState.Intro !== draft.Intro || moduleState.Text !== draft.Text)) {
        // Return to page after change
        setModuleState(draft);
        return;
    } else if (draft == null && (moduleState.Intro || moduleState.Text)) {
        // Return to page after delete
        setModuleState({
            ...DefaultModule,
            Type: module,
        });
    }

    let basePath = window.location.pathname;

    return (
        <div className='ong-advisor-module'>
            <Card variant='outlined'>
                <div style={{ float: 'right', margin: '1rem' }}>
                    <Dropdown
                        title = 'Customise'
                        items = {[
                            {
                                label: 'Customise introduction',
                                link: `${basePath}/edit/${module}/intro`,
                            },
                            {
                                label: 'Add further information',
                                link: `${basePath}/edit/${module}/text`,
                            },
                        ]}
                    />
                </div>

                <CardHeader subheader="Section introduction" />
                <CardContent>
                    {preset && !moduleState.Intro.length ?
                        <div dangerouslySetInnerHTML={{ __html: preset.Text }} className='ong-EditModule-y-adjust' />
                    : null}
                    {moduleState.Intro.length ?
                        <div dangerouslySetInnerHTML={{ __html: moduleState.Intro }} />
                    : null}
                    {moduleState.Text.length ? 
                        <div dangerouslySetInnerHTML={{ __html: moduleState.Text }} />
                    : null}
                </CardContent>
            </Card>
        </div>
    );
}

