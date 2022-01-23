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

export const PolicyProviderDialog = ({ policyProvider, setPolicyProvider, submitLabel, submitHandler }) => {
    let history = useHistory();
    let goBack = GoBack(history);

    const handlers = {
        SetName: (event) => { setPolicyProvider({ ...policyProvider, Name: event.target.value, }); },
        SetPricing: (event) => { setPolicyProvider({ ...policyProvider, Pricing: event.target.value, }); },
    };
    
    return (
        <div className="modal" >
            <Dialog open={true} onClose={goBack}>
                <form onSubmit={submitHandler}>
                    <DialogTitle>{submitLabel} Portfolio</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Enter policyProvider details
                        </DialogContentText>

                        <TextField value    = {policyProvider.Name}
                                   onChange = {handlers.SetName}
                                   margin   = "dense"
                                   id       = "name"
                                   label    = "Name"
                                   type     = "text"
                                   autoFocus fullWidth />

                        <TextField value    = {policyProvider.Pricing}
                                   onChange = {handlers.SetPricing}
                                   margin   = "dense"
                                   id       = "fee"
                                   label    = "Fee"
                                   type     = "number"
                                   fullWidth />

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={goBack}>Cancel</Button>
                        <Button type='submit' onClick={submitHandler}>{submitLabel}</Button>
                    </DialogActions>
                </form>
            </Dialog>
            </div>
    );
};

export default PolicyProviderDialog;
