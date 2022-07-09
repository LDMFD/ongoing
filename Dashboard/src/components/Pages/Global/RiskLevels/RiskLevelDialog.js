import React from 'react';
import { useHistory } from "react-router-dom";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
} from '@mui/material';

import { GoBack } from 'Utils/Routing';
import RichTextEditor from 'Components/Library/RichTextEditor/RichTextEditor';

export const RiskLevelDialog = ({ riskLevel, setRiskLevel, submitLabel, submitHandler }) => {
    let history = useHistory();
    let goBack = GoBack(history);

    const handlers = {
        EditLevel: (event) => { setRiskLevel({ ...riskLevel, Level: parseInt(event.target.value) }); },
        EditLabel: (event) => { setRiskLevel({ ...riskLevel, Label: event.target.value }); },
        EditDesc: (html) => { setRiskLevel({ ...riskLevel, Desc:  html }); },
    };
    
    return (
        <Dialog open={true} onClose={goBack}>
            <form onSubmit={submitHandler}>
                <DialogTitle>{submitLabel} RiskLevel</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter level details
                    </DialogContentText>

                    <TextField value    = {riskLevel.Level}
                               onChange = {handlers.EditLevel}
                               margin   = "dense"
                               id       = "level"
                               label    = "Level"
                               type     = "number"
                               fullWidth autoFocus />

                    <TextField value    = {riskLevel.Label}
                               onChange = {handlers.EditLabel}
                               margin   = "dense"
                               id       = "label"
                               label    = "Label"
                               type     = "text"
                               fullWidth />

                    <RichTextEditor label        = 'Description'
                                    initialValue = {riskLevel.Desc}
                                    onChange     = {handlers.EditDesc} />

                </DialogContent>
                <DialogActions>
                    <Button onClick={goBack}>Cancel</Button>
                    <Button type='submit'>{submitLabel}</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default RiskLevelDialog;
