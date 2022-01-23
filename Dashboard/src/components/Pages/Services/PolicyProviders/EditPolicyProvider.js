import React, { useEffect, useContext, useCallback, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';

import { Context } from 'State/StateProvider'
import { SET_POLICY_PROVIDERS } from 'State/Reducer';
import { GoBack } from 'Utils';

const EditPolicyProvider = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ , dispatch] = useContext(Context);
    let [ policyProvider, setPolicyProvider ] = useState({
        Name: '',
        Pricing: '',
    });

    let { policyProviderId } = useParams();
    policyProviderId = parseInt(policyProviderId);

    const getPolicyProviders = useCallback(() => {
        window.ApiClient.get("/policy-providers").then(res => {
            dispatch({
                type: SET_POLICY_PROVIDERS,
                payload: res.data,
            });
            setPolicyProvider(res.data.PolicyProviders.find(c => c.Id === policyProviderId));
        });
     }, [ policyProviderId, dispatch ]);

    useEffect(() => {
        getPolicyProviders();
    }, [ getPolicyProviders ]);

    const handleChangeName = (event) => {
        setPolicyProvider({
            ...policyProvider,
            Name: event.target.value,
        });
    }

    const handleChangePricing = (event) => {
        setPolicyProvider({
            ...policyProvider,
            Pricing: event.target.value,
        });
    }

    const submit = (e) => {
        e.preventDefault();
        window.ApiClient.put(`/policy-providers/${policyProvider.Id}`, {
            ...policyProvider
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
                <DialogTitle>Edit Policy Provider</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter policy provider
                    </DialogContentText>

                    <TextField value    = {policyProvider.Name}
                               onChange = {handleChangeName}
                               margin   = "dense"
                               id       = "name"
                               label    = "Name"
                               provider     = "text"
                               autoFocus fullWidth />

                    <TextField value    = {policyProvider.Pricing}
                               onChange = {handleChangePricing}
                               margin   = "dense"
                               id       = "pricing"
                               label    = "Pricing"
                               provider = "text"
                               fullWidth />

                </DialogContent>
                <DialogActions>
                    <Button onClick={goBack}>Cancel</Button>
                    <Button onClick={submit}>Update</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default EditPolicyProvider;
