import React, { useContext, useState } from 'react';
import { useHistory } from "react-router-dom";

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { Context } from '../../../../Store'
import { SET_POLICY_PROVIDERS } from '../../../../Reducer';

const AddPolicyProvider = () => {
    let history = useHistory();
    const [ , dispatch] = useContext(Context);

    let [ name, setName ] = useState('');
    let [ pricing, setPricing ] = useState('');

    let back = e => {
        if (e) {
            e.stopPropagation();
        }
        history.goBack();
    };

    const submit = () => {
        window.ApiClient.post("/policy-providers", {
            Name: name,
            Pricing: pricing,
        }).then(_ => {
            window.ApiClient.get("/policy-providers").then(res => {
                dispatch({
                    type: SET_POLICY_PROVIDERS,
                    payload: res.data,
                })
            }).then(back);;
        });
    };

    return (
        <div className="modal" >
            <Dialog open={true} onClose={back}>
                <DialogTitle>Add Policy Provider</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter policy provider details
                    </DialogContentText>

                    <TextField value    = {name}
                               onChange = {(e) => setName(e.target.value)}
                               margin   = "dense"
                               id       = "name"
                               label    = "Name"
                               provider     = "text"
                               autoFocus fullWidth />

                    <TextField value    = {pricing}
                               onChange = {(e) => setPricing(e.target.value)}
                               margin   = "dense"
                               id       = "pricing"
                               label    = "Pricing"
                               provider = "text"
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

export default AddPolicyProvider;
