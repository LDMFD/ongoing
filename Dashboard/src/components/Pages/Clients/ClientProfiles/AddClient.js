import React, { useContext, useState } from 'react';
import { useHistory } from "react-router-dom";
import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';

import { Context } from 'Store'
import { SET_CLIENTS } from 'Reducer';
import { GoBack } from 'Utils';

const AddClient = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ , dispatch] = useContext(Context);

    let [ surname, setSurname ] = useState('');
    let [ forenames, setForenames ] = useState('');

    const handleChangeSurname = (event) => {
        setSurname(event.target.value);
    }
    const handleChangeForenames = (event) => {
        setForenames(event.target.value);
    }

    const submit = (e) => {
        e.preventDefault();
        window.ApiClient.post("/clients", {
            Surname: surname,
            Forenames: forenames,
        })
        .then(() => {
            goBack();
        })
        .then(_ => {
            window.ApiClient.get("/clients").then(res => {
                dispatch({
                    type: SET_CLIENTS,
                    payload: res.data,
                })
            });
        });
        return false;
    };

    return (
        <div className="modal" >
            <Dialog open={true} onClose={goBack}>
                <form onSubmit={submit}>
                    <DialogTitle>Add Client</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Enter client details
                        </DialogContentText>

                        <TextField value    = {surname}
                                onChange = {handleChangeSurname}
                                margin   = "dense"
                                id       = "surname"
                                label    = "Surname"
                                type     = "text"
                                variant  = "standard"
                                autoFocus
                                fullWidth />

                        <TextField value    = {forenames}
                                onChange = {handleChangeForenames}
                                margin  = "dense"
                                id      = "forenames"
                                label   = "Forenames"
                                type    = "text"
                                variant = "standard"
                                fullWidth />

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={goBack}>Cancel</Button>
                        <Button type='submit'>Add</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    );
}

export default AddClient;
