import React from 'react';
import { useHistory } from "react-router-dom";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from '@mui/material';

import { GoBack } from 'Utils/Routing';

export const OrgDialog = ({ org, setOrg, submitLabel, submitHandler }) => {
    let history = useHistory();
    let goBack = GoBack(history);

    const handlers = {
        SetSurname: (event) => {
            setOrg({
                ...org,
                Surname: event.target.value,
            });
        },
        SetForenames: (event) => {
            setOrg({
                ...org,
                Forenames: event.target.value,
            });
        },
        SetEmail: (event) => {
            setOrg({
                ...org,
                Email: event.target.value,
            })
        },
        SetName: (event) => {
            setOrg({
                ...org,
                Name: event.target.value,
            })
        },
    };

    return (
        <Dialog open={true} onClose={goBack}>
            <form onSubmit={submitHandler} className='org-dialog'>
                <DialogTitle>{submitLabel} Organisation</DialogTitle>
                <DialogContent>

                <TextField value    = {org.Name}
                           onChange = {handlers.SetName}
                           margin   = "dense"
                           id       = "name"
                           label    = "Organisation Name"
                           type     = "text"
                           variant  = "standard"
                           autoFocus fullWidth />

                {submitLabel === 'Add' && (
                    <>
                        <TextField value = {org.Email}
                                onChange = {handlers.SetEmail}
                                margin   = "dense"
                                id       = "email"
                                label    = "Owner email"
                                type     = "email"
                                variant  = "standard"
                                fullWidth />

                        <TextField value = {org.Surname}
                                onChange = {handlers.SetSurname}
                                margin   = "dense"
                                id       = "surname"
                                label    = "Owner surname"
                                type     = "text"
                                variant  = "standard"
                                fullWidth />

                        <TextField value = {org.Forenames}
                                onChange = {handlers.SetForenames}
                                margin   = "dense"
                                id       = "forenames"
                                label    = "Owner forenames"
                                type     = "text"
                                variant  = "standard"
                                fullWidth />
                    </>
                )}

                </DialogContent>
                <DialogActions>
                    <Button onClick={goBack}>Cancel</Button>
                    <Button type='submit'>{submitLabel}</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default OrgDialog;
