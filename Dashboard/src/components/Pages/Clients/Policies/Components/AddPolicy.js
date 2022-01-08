import React, { useContext, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';

import { Context } from 'Store'
import { POPULATE_CLIENT } from 'Reducer';

const AddPolicy = () => {
    let history = useHistory();
    const [ state, dispatch] = useContext(Context);

    let { clientId } = useParams();
    clientId = parseInt(clientId);

    let [ externalId, setExternalId ] = useState('');
    let [ platformDiscount, setPlatformDiscount ] = useState('');
    let [ policyTypeId, setPolicyTypeId ] = useState('select');
    let [ providerId, setProviderId ] = useState('select');

    let back = e => {
        if (e) {
            e.stopPropagation();
        }
        history.goBack();
    };

    const submit = () => {
        return window.ApiClient.post(`/clients/${clientId}/policies`, {
            ExternalId:       externalId,
            PlatformDiscount: platformDiscount,
            PolicyTypeId:     policyTypeId,
            PolicyProviderId: providerId,

        }).then(_ => {
            window.ApiClient.get(`/clients/${clientId}`).then(res => {
                dispatch({
                    type: POPULATE_CLIENT,
                    payload: res.data,
                })
            }).then(back);
        });
    };

    let handleDiscountChange = (v) => {
        let discount = parseFloat(v);
        setPlatformDiscount(discount);
    }

    return (
        <div className="modal" >
            <Dialog open={true} onClose={back}>
                <DialogTitle>Add Client Policy</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter policy details
                    </DialogContentText>

                    <TextField value    = {externalId}
                               onChange = {(e) => setExternalId(e.target.value)}
                               margin   = "dense"
                               id       = "externalId"
                               label    = "ExternalId"
                               type     = "text"
                               autoFocus fullWidth />

                    <TextField value    = {platformDiscount}
                               onChange = {(e) => handleDiscountChange(e.target.value)}
                               margin   = "dense"
                               id       = "platformDiscount"
                               label    = "Platform Discount"
                               type     = "number"
                               fullWidth />

                    <Select value    = {policyTypeId}
                            onChange = {(e) => setPolicyTypeId(e.target.value)}
                            margin   = "dense"
                            id       = "type"
                            label    = "Type"
                            type     = "text"
                            fullWidth>
                        <MenuItem value='select'>Select policy</MenuItem>
                        {state.policyTypes.map(t => (
                            <MenuItem value={t.Id} key={t.Id}>
                                {t.Name}
                            </MenuItem>
                        ))}
                    </Select>

                    <Select value    = {providerId}
                            onChange = {(e) => setProviderId(e.target.value)}
                            margin   = "dense"
                            id       = "type"
                            label    = "Type"
                            type     = "text"
                            fullWidth>
                        <MenuItem value='select'>Select provider</MenuItem>
                        {state.policyProviders.map(t => (
                            <MenuItem value={t.Id} key={t.Id}>
                                {t.Name}
                            </MenuItem>
                        ))}
                    </Select>

                </DialogContent>
                <DialogActions>
                    <Button onClick={back}>Cancel</Button>
                    <Button onClick={submit}>Add</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default AddPolicy;
