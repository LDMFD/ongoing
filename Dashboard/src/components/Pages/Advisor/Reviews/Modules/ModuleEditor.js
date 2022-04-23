import React, { useContext, useState } from 'react';
import { Link, useParams, useHistory  } from 'react-router-dom';
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';

import { GoBack } from 'Utils/Routing';
import RichTextEditor from 'Components/Widgets/RichTextEditor';

import './EditModule.css';
import { Api } from 'State';
import { Context } from 'State/StateProvider'
import { DefaultModule } from './DefaultModule';

export const EditModuleText = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch ] = useContext(Context);

    let { clientId, rmod: module, field } = useParams();
    let capsField = field.charAt(0).toUpperCase() + field.slice(1);

    let [ moduleState, setModuleState ] = useState(null);
    let preset;

    if (!moduleState) {
        let draft = state.Report.Modules.find(m => m.Type === module);

        let newState = {
            ...DefaultModule,
            Type: module,
        };

        if (draft) {
            newState.Intro = draft.Intro;
            newState.Text = draft.Text;
        } else {
            preset = state.Report.ModulePresets.find(p => p.ModuleType === module);
            if (field === 'intro' && preset) {
                newState.Intro = preset.Text;
            }
        }
        setModuleState(newState);
        return;
    }
            
    let onChange = (html) => {
        setModuleState({ ...moduleState, [capsField]: html, });
    };

    let onSubmit = async (e) => {
        e.preventDefault();
        await Api.Clients.ReviewModules.Update(clientId, module, moduleState);
        await Api.Clients.ClientDetail.Read(dispatch, clientId);
        goBack();
        return false;
    };

    let onDelete = async () => {
        await Api.Clients.ReviewModules.Delete(clientId, module, field);
        await Api.Clients.ClientDetail.Read(dispatch, clientId);
        goBack();
    }

    let deleteLabel = preset ? 'Reset to preset' : 'Delete'
    let deleteDisabled = preset === undefined && moduleState[capsField] === '';  // TODO doesn't disable on first try for some reason..

    return (
        <Dialog open={true} onClose={goBack}>
            <form onSubmit={onSubmit}>
                <DialogTitle>Edit Module Text</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter fund details
                    </DialogContentText>

                        <Card variant='outlined'>
                            <CardHeader subheader={`Enter text`} />
                            <CardContent>
                                <RichTextEditor initialValue = {moduleState[capsField]}
                                                onChange     = {onChange} />
                            </CardContent>
                        </Card>

                    </DialogContent>
                <DialogActions>
                    <Button onClick={goBack}>Cancel</Button>
                    <Button disabled={deleteDisabled} variant='outlined' onClick={onDelete}>{deleteLabel}</Button>
                    <Button type='submit' variant='contained' onClick={onSubmit}>Update</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export const ModuleEditor = ({ client, module }) => {
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
