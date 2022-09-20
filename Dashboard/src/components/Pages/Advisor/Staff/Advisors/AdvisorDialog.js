import React from 'react';
import { useHistory } from "react-router-dom";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from '@mui/material';

import { GoBack } from 'Utils/Routing';
import SendSignInLink from "Components/Library/Auth/AuthEmailer";

export const AdvisorDialog = ({ advisor, setAdvisor, submitLabel, submitHandler }) => {
    let history = useHistory();
    let goBack = GoBack(history);

    const handlers = {
        SetSurname: (event) => {
            setAdvisor({
                ...advisor,
                Surname: event.target.value,
            });
        },
        SetForenames: (event) => {
            setAdvisor({
                ...advisor,
                Forenames: event.target.value,
            });
        },
        SetEmail: (event) => {
            setAdvisor({
                ...advisor,
                Email: event.target.value,
            })
        },
        SetRole: (event) => {
            setAdvisor({
                ...advisor,
                Role: event.target.value,
            })
        },
    };

    return (
        <Dialog open={true} onClose={goBack}>
            <form onSubmit={submitHandler}>
                <DialogTitle>{submitLabel} Staff Member</DialogTitle>
                <DialogContent>

                    <TextField value    = {advisor.Email}
                               onChange = {handlers.SetEmail}
                               margin   = "dense"
                               id       = "email"
                               label    = "Email"
                               type     = "text"
                               variant  = "standard"
                               autoFocus fullWidth />

                    <TextField value    = {advisor.Surname}
                               onChange = {handlers.SetSurname}
                               margin   = "dense"
                               id       = "surname"
                               label    = "Surname"
                               type     = "text"
                               variant  = "standard"
                               fullWidth />

                    <TextField value    = {advisor.Forenames}
                               onChange = {handlers.SetForenames}
                               margin   = "dense"
                               id       = "forenames"
                               label    = "Forenames"
                               type     = "text"
                               variant  = "standard"
                               fullWidth />
                
                {(advisor.Role !== 'owner') && (
                    <>
                        <br />
                        <br />
                        <FormControl sx={{ width: `30ch` }}>
                            <InputLabel id='ong-select-role'>Role</InputLabel>
                            <Select labelId  = 'ong-select-role'
                                    value    = {advisor.Role || ''}
                                    onChange = {handlers.SetRole}
                                    margin   = "dense"
                                    id       = "role"
                                    label    = "Role"
                                    type     = "text"
                                    fullWidth autoFocus>
                                <MenuItem value='administrator'>administrator</MenuItem>
                                <MenuItem value='advisor'>advisor</MenuItem>
                            </Select>
                        </FormControl>
                    </>
                )}

                </DialogContent>
                <DialogActions>
                    <Button onClick={SendSignInLink.bind(null, advisor.Email)}>
                        Send sign-in link
                    </Button>
                    <Button onClick={goBack}>Cancel</Button>
                    <Button type='submit'>{submitLabel}</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default AdvisorDialog;
