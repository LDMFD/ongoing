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

export const ProviderChargeDialog = ({ providerCharge, setProviderCharge, submitLabel, submitHandler }) => {
    let history = useHistory();
    let goBack = GoBack(history);

    const handlers = {
        EditDesc:      (event) => { setProviderCharge({ ...providerCharge, Desc:   event.target.value }); },
        EditCharge:    (event) => { setProviderCharge({ ...providerCharge, Charge: parseFloat(event.target.value) }); },
    };
    
    return (
        <Dialog open={true} onClose={goBack}>
            <form onSubmit={submitHandler}>
                <DialogTitle>{submitLabel} ProviderCharge</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter charge details
                    </DialogContentText>

                    <TextField value    = {providerCharge.Desc}
                               onChange = {handlers.EditDesc}
                               margin   = "dense"
                               id       = "desc"
                               label    = "Desc"
                               type     = "text"
                               autoFocus fullWidth />

                    <TextField value = {providerCharge.Charge}
                            onChange = {handlers.EditCharge}
                            margin   = "dense"
                            id       = "charge"
                            label    = "Charge"
                            type     = "number"
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

export default ProviderChargeDialog;
