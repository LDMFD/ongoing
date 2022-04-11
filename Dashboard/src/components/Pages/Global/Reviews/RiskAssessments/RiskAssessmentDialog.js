import React, {  } from 'react';
import { useHistory,  } from "react-router-dom";
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
import RichTextEditor from 'Components/Widgets/RichTextEditor';

export const RiskAssessmentDialog = ({ riskAssessment, setRiskAssessment, submitLabel, submitHandler }) => {
    let history = useHistory();
    let goBack = GoBack(history);

    const handlers = {
        SetLabel: (event) => { setRiskAssessment({ ...riskAssessment, Label: event.target.value, }); },
        SetText:  (html)  => { setRiskAssessment({ ...riskAssessment, Text:  html, }); },
    };
    
    return (
        <Dialog open={true} onClose={goBack}>
            <form onSubmit={submitHandler}>
                <DialogTitle>{submitLabel} RiskAssessment Template</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter Risk Assessment details
                    </DialogContentText>

                    <TextField value    = {riskAssessment.Label}
                               onChange = {handlers.SetLabel}
                               margin   = "dense"
                               id       = "label"
                               label    = "Select menu label"
                               type     = "text"
                               variant  = "standard"
                               autoFocus
                               fullWidth />

                    <h4>
                        Risk Assessment:
                    </h4>
                    <RichTextEditor initialValue = {riskAssessment.Text}
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

export default RiskAssessmentDialog;
