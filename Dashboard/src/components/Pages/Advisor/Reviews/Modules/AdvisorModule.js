import React, { useContext, useState } from 'react';
import { Link  } from 'react-router-dom';
import {
    Button,
    Card,
    CardContent,
    CardHeader,
} from '@mui/material';

import './AdvisorModule.css';
import { Context } from 'State/StateProvider'
import { DefaultModule } from './DefaultModule';

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
        <div className='ong-EditModule'>
            <br />

            {preset &&
                <Card variant='outlined'>
                    <CardHeader subheader="Preset Introduction" />
                    <CardContent>
                        <div dangerouslySetInnerHTML={{ __html: preset.Text }} />
                    </CardContent>
                </Card>
            }

            {moduleState.Intro.length ? 
                <Card variant='outlined'>
                    <CardHeader subheader="Custom Introduction" />
                    <CardContent>
                        <div dangerouslySetInnerHTML={{ __html: moduleState.Intro }} />
                        <Link to={{ pathname: `${basePath}/edit/${module}/intro` }}><Button>Edit</Button></Link>
                    </CardContent>
                </Card>
            :
                <Link to={{ pathname: `${basePath}/edit/${module}/intro` }}>
                    <Button>
                        Override preset introduction
                    </Button>
                </Link>
            }

            {moduleState.Text.length ?
                <Card variant='outlined'>
                    <CardHeader subheader="Custom Body" />
                    <CardContent>
                        <div dangerouslySetInnerHTML={{ __html: moduleState.Text }} />

                        <Link to={{ pathname: `${basePath}/edit/${module}/text` }}><Button>Edit</Button></Link>
                    </CardContent>
                </Card>
            :
                <Link to={{ pathname: `${basePath}/edit/${module}/text` }}>
                    <Button>
                        Add custom paragraph
                    </Button>
                </Link>
            }
        </div>
    );
}
