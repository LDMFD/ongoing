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

import { GoBack } from 'Utils';
import RichTextEditor from 'components/Widgets/RichTextEditor';

export const DiligenceTemplateDialog = ({ diligenceTemplate, setDiligenceTemplate, submitLabel, submitHandler }) => {
    let history = useHistory();
    let goBack = GoBack(history);

    const handlers = {
        SetLabel: (event) => { setDiligenceTemplate({ ...diligenceTemplate, Label: event.target.value, }); },
        SetText:  (html)  => { setDiligenceTemplate({ ...diligenceTemplate, Text:  html, }); },
    };
    
    return (
        <Dialog open={true} onClose={goBack}>
            <form onSubmit={submitHandler}>
                <DialogTitle>{submitLabel} Diligence Template</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter Due Diligence Template details
                    </DialogContentText>

                    <TextField value    = {diligenceTemplate.Label}
                               onChange = {handlers.SetLabel}
                               margin   = "dense"
                               id       = "label"
                               label    = "Select menu label"
                               type     = "text"
                               variant  = "standard"
                               autoFocus
                               fullWidth />

                    <h4>
                        Due Diligence template:
                    </h4>
                    <RichTextEditor initialValue = {diligenceTemplate.Text}
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

export default DiligenceTemplateDialog;
