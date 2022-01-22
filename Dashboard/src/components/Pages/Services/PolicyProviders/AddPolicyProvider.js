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

import { Context } from 'StateProvider'
import { SET_POLICY_PROVIDERS } from 'Reducer';
import { GoBack } from 'Utils';

const AddPolicyProvider = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ , dispatch] = useContext(Context);

    let [ name, setName ] = useState('');
    let [ pricing, setPricing ] = useState('');

    const submit = (e) => {
        e.preventDefault();
        window.ApiClient.post("/policy-providers", {
            Name: name,
            Pricing: pricing,
        }).then(_ => {
            window.ApiClient.get("/policy-providers").then(res => {
                dispatch({
                    type: SET_POLICY_PROVIDERS,
                    payload: res.data,
                })
            }).then(() => {
                goBack();
            });
        });
        return false;
    };

    return (
        <div className="modal" >
            <Dialog open={true} onClose={goBack}>
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
                               fullWidth />

                </DialogContent>
                <DialogActions>
                    <Button onClick={goBack}>Cancel</Button>
                    <Button onClick={submit}>Add</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default AddPolicyProvider;
