import React, { useContext, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    MenuItem,
    Select,
} from '@mui/material';

import { Context } from 'Store'
import { POPULATE_CLIENT } from 'Reducer';
import { GoBack } from 'Utils';

const EditPolicy = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch] = useContext(Context);
    let [ policy, setPolicy ] = useState(null);

    let { clientId, policyId } = useParams();
    clientId = parseInt(clientId);
    policyId = parseInt(policyId);

    if (!policy) {
        let client = state.clients.find(c => c.Id === clientId);
        let p = client.Policies.find(p => p.Id === policyId);
        setPolicy(p);
        return;
    }

    const getClientDetail = async () => {
        return window.ApiClient.get(`/clients/${clientId}`).then(res => {
            dispatch({
                type: POPULATE_CLIENT,
                payload: res.data,
            });
        });
    };

    const submit = (e) => {
        e.preventDefault();
        window.ApiClient.put(`/clients/${clientId}/policies/${policyId}`, {
            ...policy
        })
        .then(() => {
            goBack();
        })
        .then(async () => {
            await getClientDetail();
        });
        return false;
    };

    const onEditExternalId   = (event) => { setPolicy({ ...policy, ExternalId:          event.target.value }); }
    const onEditDiscount     = (event) => { setPolicy({ ...policy, PlatformDiscount:    parseFloat(event.target.value), }); }
    const onEditPolicyTypeId = (event) => { setPolicy({ ...policy, PolicyTypeId:        parseInt(event.target.value), }); }
    const onEditProviderId   = (event) => { setPolicy({ ...policy, PolicyProviderId:    parseInt(event.target.value), }); }

    return (
        <div className="modal" >
            <Dialog open={true} onClose={goBack}>
                <DialogTitle>Edit Policy Type</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Edit policy
                    </DialogContentText>

                    <TextField value    = {policy.ExternalId}
                               onChange = {onEditExternalId}
                               margin   = "dense"
                               id       = "externalId"
                               label    = "Policy number"
                               type     = "text"
                               autoFocus fullWidth />

                    <TextField value    = {policy.PlatformDiscount}
                               onChange = {onEditDiscount}
                               margin   = "dense"
                               id       = "platformDiscount"
                               label    = "Platform Discount"
                               type     = "number"
                               fullWidth />

                    <Select value    = {policy.PolicyTypeId}
                            onChange = {onEditPolicyTypeId}
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

                    <Select value    = {policy.PolicyProviderId}
                            onChange = {onEditProviderId}
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
                    <Button onClick={goBack}>Cancel</Button>
                    <Button onClick={submit}>Update</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default EditPolicy;
