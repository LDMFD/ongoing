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

export const RiskLevelDialog = ({ riskLevel, setRiskLevel, submitLabel, submitHandler }) => {
    let history = useHistory();
    let goBack = GoBack(history);

    const handlers = {
        EditLevel: (event) => { setRiskLevel({ ...riskLevel, Level: parseInt(event.target.value) }); },
        EditLabel: (event) => { setRiskLevel({ ...riskLevel, Label: event.target.value }); },
        EditDesc:  (event) => { setRiskLevel({ ...riskLevel, Desc:  event.target.value }); },
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

                    <TextField value    = {riskLevel.Desc}
                               onChange = {handlers.EditDesc}
                               margin   = "dense"
                               id       = "desc"
                               label    = "Desc"
                               type     = "text"
                               fullWidth />

                </DialogContent>
                <DialogActions>
                    <Button onClick={goBack}>Cancel</Button>
                    <Button type='submit' onClick={submitHandler}>{submitLabel}</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default RiskLevelDialog;
