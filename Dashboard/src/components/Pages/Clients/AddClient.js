import React, { useContext, useState } from 'react';
import { useHistory } from "react-router-dom";

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { Context } from '../../../Store'
import { SET_CLIENTS } from '../../../Reducer';

const AddClient = () => {
    let history = useHistory();
    const [ , dispatch] = useContext(Context);
    let [ surname, setSurname ] = useState('');
    let [ forenames, setForenames ] = useState('');

    const handleChangeSurname = (event) => {
        setSurname(event.target.value);
    }
    const handleChangeForenames = (event) => {
        setForenames(event.target.value);
    }

    let back = e => {
        if (e) {
            // TODO either use location to see if we came from this site or not,
            // or just change strategy to strip last path element regardless.
            e.stopPropagation();
        }
        history.goBack();
    };

    const submit = () => {
        window.ApiClient.post("/clients", {
            Surname: surname,
            Forenames: forenames,
        }).then(_ => {
            window.ApiClient.get("/clients").then(res => {
                dispatch({
                    type: SET_CLIENTS,
                    payload: res.data,
                })
            }).then(back);;
        });
    };

    return (
        <div className="modal" >
            <Dialog open={true} onClose={back}>
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
                    <Button onClick={back}>Cancel</Button>
                    <Button onClick={submit}>Add</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default AddClient;
