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

import { GoBack } from 'Utils/Routing';

const ClientDialog = ({ client, setClient, submitLabel, submitHandler }) => {
    let history = useHistory();
    let goBack = GoBack(history);

    const handlers = {
        SetSurname: (event) => {
            setClient({
                ...client,
                Identity: {
                    ...client.Identity,
                    Surname: event.target.value,
                },
            });
        },
        SetForenames: (event) => {
            setClient({
                ...client,
                Identity: {
                    ...client.Identity,
                    Forenames: event.target.value,
                },
            });
        },
        SetEmail: (event) => {
            setClient({
                ...client,
                Identity: {
                    ...client.Identity,
                    Email: event.target.value,
                },
            });
        },
        SetFee: (event) => {
            setClient({
                ...client,
                Fee: parseFloat(event.target.value),
            });
        },
    }

    return (
        <Dialog open={true} onClose={goBack}>
            <form onSubmit={submitHandler}>
                <DialogTitle>{submitLabel} Client</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter client details
                    </DialogContentText>

                    <TextField value    = {client.Identity.Surname}
                               onChange = {handlers.SetSurname}
                               margin   = "dense"
                               id       = "surname"
                               label    = "Surname"
                               type     = "text"
                               variant  = "standard"
                               autoFocus
                               fullWidth />

                    <TextField value    = {client.Identity.Forenames}
                               onChange = {handlers.SetForenames}
                               margin   = "dense"
                               id       = "forenames"
                               label    = "Forenames"
                               type     = "text"
                               variant  = "standard"
                               fullWidth />

                    <TextField value    = {client.Identity.Email}
                               onChange = {handlers.SetEmail}
                               margin   = "dense"
                               id       = "email"
                               label    = "Email"
                               type     = "email"
                               variant  = "standard"
                               fullWidth />

                    <TextField value    = {client.Fee}
                               onChange = {handlers.SetFee}
                               margin   = "dense"
                               id       = "fee"
                               label    = "Fee"
                               type     = "fee"
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
