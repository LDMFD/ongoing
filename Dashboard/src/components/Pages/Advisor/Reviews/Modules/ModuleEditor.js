import React, { useContext, useState } from 'react';
import { useParams, useHistory  } from 'react-router-dom';
import {
    Button,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';

import { GoBack } from 'Utils/Routing';
import RichTextEditor from 'Components/Library/RichTextEditor/RichTextEditor';

import './AdvisorModule.css';
import { Api } from 'State';
import { Context } from 'State/StateProvider'
import { DefaultModule } from './DefaultModule';

export const ModuleEditor = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    let checkGoBack = () => {
        if (moduleState.editCount < 1 || window.confirm('Discard unsaved changes?')) {
            goBack();
        }
    }

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
        setModuleState({
            ...moduleState,
            [capsField]: html,
            editCount: moduleState.editCount + 1,
        });
    };

    let onSubmit = async (e) => {
        e.preventDefault();
        await Api.Advisor.ReviewModules.Update(clientId, module, moduleState);
        await Api.Advisor.ClientDetail.Read(dispatch, clientId);
        goBack();
        return false;
    };

    let onDelete = async () => {
        await Api.Advisor.ReviewModules.Delete(clientId, module, field);
        await Api.Advisor.ClientDetail.Read(dispatch, clientId);
        goBack();
    }

    let deleteLabel = preset ? 'Reset to preset' : 'Delete'
    let deleteDisabled = preset === undefined && moduleState[capsField] === '';  // TODO doesn't disable on first try for some reason..

    return (
        <Dialog open={true} onClose={checkGoBack}>
            <form onSubmit={onSubmit}>
                <DialogTitle>Edit Module Text</DialogTitle>
                <DialogContent>
                    <CardContent>
                        <RichTextEditor label        = 'Module text'
                                        initialValue = {moduleState[capsField]}
                                        onChange     = {onChange} />
                    </CardContent>
                </DialogContent>
                <DialogActions>
                    <Button onClick={checkGoBack}>Cancel</Button>
                    <Button disabled={deleteDisabled} variant='outlined' onClick={onDelete}>{deleteLabel}</Button>
                    <Button type='submit' variant='contained'>Update</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
