import React, { } from 'react';
import { useHistory } from 'react-router-dom';
import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';

import { GoBack } from 'Utils';

const ClientDialog = ({ client, setClient, submitLabel, submitHandler }) => {
    let history = useHistory();
    let goBack = GoBack(history);

    const handlers = {
        SetSurname:   (event) => { setClient({ ...client, Surname:   event.target.value, }); },
        SetForenames: (event) => { setClient({ ...client, Forenames: event.target.value, }); },
        SetEmail:     (event) => { setClient({ ...client, Email:     event.target.value, }); },
    }

    return (
        <Dialog open={true} onClose={goBack}>
            <form onSubmit={submitHandler}>
                <DialogTitle>{submitLabel} Client</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter client details
                    </DialogContentText>

                    <TextField value    = {client.Surname}
                               onChange = {handlers.SetSurname}
                               margin   = "dense"
                               id       = "surname"
                               label    = "Surname"
                               type     = "text"
                               variant  = "standard"
                               autoFocus
                               fullWidth />

                    <TextField value    = {client.Forenames}
                               onChange = {handlers.SetForenames}
                               margin   = "dense"
                               id       = "forenames"
                               label    = "Forenames"
                               type     = "text"
                               variant  = "standard"
                               fullWidth />

                    <TextField value    = {client.Email}
                               onChange = {handlers.SetEmail}
                               margin   = "dense"
                               id       = "email"
                               label    = "Email"
                               type     = "email"
                               variant  = "standard"
                               fullWidth />

                </DialogContent>
                <DialogActions>
                    <Button onClick={goBack}>Cancel</Button>
                    <Button type='submit'>{submitLabel}</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export default ClientDialog;
