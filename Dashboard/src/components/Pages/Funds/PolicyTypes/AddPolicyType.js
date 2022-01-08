import React, { useContext, useState } from 'react';
import { useHistory } from "react-router-dom";

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { Context } from 'Store'
import { SET_POLICY_TYPES } from 'Reducer';

const AddPolicyType = () => {
    let history = useHistory();
    const [ , dispatch] = useContext(Context);

    let [ name, setName ] = useState('');

    let back = e => {
        if (e) {
            e.stopPropagation();
        }
        history.goBack();
    };

    const submit = () => {
        window.ApiClient.post("/policy-types", {
            Name: name,
        }).then(_ => {
            window.ApiClient.get("/policy-types").then(res => {
                dispatch({
                    type: SET_POLICY_TYPES,
                    payload: res.data,
                })
            }).then(back);;
        });
    };

    return (
        <div className="modal" >
            <Dialog open={true} onClose={back}>
                <DialogTitle>Add Policy Type</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter policy type
                    </DialogContentText>

                    <TextField value    = {name}
                               onChange = {(e) => setName(e.target.value)}
                               margin   = "dense"
                               id       = "name"
                               label    = "Name"
                               type     = "text"
                               autoFocus fullWidth />

                </DialogContent>
                <DialogActions>
                    <Button onClick={back}>Cancel</Button>
                    <Button onClick={submit}>Add</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default AddPolicyType;
