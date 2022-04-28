import React, {  } from 'react';
import { useHistory,  } from "react-router-dom";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Select,
    MenuItem,
} from '@mui/material';
import RichTextEditor from 'Components/Library/RichTextEditor';

import { GoBack } from 'Utils/Routing';
import { ModuleTypeSelectSpec } from 'State/ApiCommands/Global/Reviews/ModuleTypes';

import './ModulePresetDialog.css';

export const ModulePresetDialog = ({ modulePreset, setModulePreset, submitLabel, submitHandler }) => {
    let history = useHistory();
    let goBack = GoBack(history);

    const handlers = {
        SetModuleType: (event) => { setModulePreset({ ...modulePreset, ModuleType: event.target.value, }); },
        SetText:       (html) => { setModulePreset({ ...modulePreset, Text:        html, }); },
    };
    
    return (
        <Dialog open={true} onClose={goBack}>
            <form onSubmit={submitHandler}>
                <DialogTitle>{submitLabel} Module Preset</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter Module Preset details
                    </DialogContentText>

                    <Select value    = {modulePreset.ModuleType ? modulePreset.ModuleType : 'select'}
                            onChange = {handlers.SetModuleType}
                            margin   = "dense"
                            id       = "type"
                            label    = "Type"
                            type     = "text"
                            autoFocus fullWidth>
                                <MenuItem value='select'>Select module</MenuItem>
                                {ModuleTypeSelectSpec.map(m => (
                                    <MenuItem value={m.id} key={m.id}>
                                        {m.label}
                                    </MenuItem>
                                ))}
                    </Select>

                    <h4>
                        Preset text:
                    </h4>
                    <RichTextEditor initialValue = {modulePreset.Text}
                                    onChange     = {handlers.SetText} />

                </DialogContent>
                <DialogActions>
                    <Button onClick={goBack}>Cancel</Button>
                    <Button type='submit' onClick={submitHandler}>{submitLabel}</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default ModulePresetDialog;
