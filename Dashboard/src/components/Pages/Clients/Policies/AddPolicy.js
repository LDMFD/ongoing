import React, { useContext, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    MenuItem,
    Select,
    TextField,
} from '@mui/material';

import { Context } from 'State/StateProvider'
import { POPULATE_CLIENT } from 'State/Reducer';
import { GoBack } from 'Utils';

const AddPolicy = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch] = useContext(Context);

    let { clientId } = useParams();
    clientId = parseInt(clientId);

    let [ externalId, setExternalId ] = useState('');
    let [ platformDiscount, setPlatformDiscount ] = useState('');
    let [ policyTypeId, setPolicyTypeId ] = useState('select');
    let [ providerId, setProviderId ] = useState('select');

    const submit = (e) => {
        e.preventDefault();
        window.ApiClient.post(`advisor/clients/${clientId}/policies`, {
            ExternalId:       externalId,
            PlatformDiscount: platformDiscount,
            PolicyTypeId:     policyTypeId,
            PolicyProviderId: providerId,
        })
        .then(() => {
            goBack();
        })
        .then(_ => {
            window.ApiClient.get(`advisor/clients/${clientId}`).then(res => {
                dispatch({
                    type: POPULATE_CLIENT,
                    payload: res.data,
                })
            });
        });
        return false;
    };

    let handleDiscountChange = (v) => {
        let discount = parseFloat(v);
        setPlatformDiscount(discount);
    }

    return (
        <div className="modal" >
            <Dialog open={true} onClose={goBack}>
                <form onSubmit={submit}>
                    <DialogTitle>Add Client Policy</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Enter policy details
                        </DialogContentText>

                        <TextField value    = {externalId}
                                onChange = {(e) => setExternalId(e.target.value)}
                                margin   = "dense"
                                id       = "externalId"
                                label    = "Policy number"
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
                            <MenuItem value='select'>Select policy type</MenuItem>
                            {state.PolicyTypes?.map(t => (
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
                            {state.PolicyProviders?.map(t => (
                                <MenuItem value={t.Id} key={t.Id}>
                                    {t.Name}
                                </MenuItem>
                            ))}
                        </Select>

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

export default AddPolicy;
