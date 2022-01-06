import React, { useEffect, useContext, useCallback, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { Context } from '../../../../Store'
import { SET_POLICY_PROVIDERS } from '../../../../Reducer';

const EditPolicyProvider = () => {
    let history = useHistory();

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

    let back = e => {
        if (e) {
            e.stopPropagation();
        }
        history.goBack();
    };

    const submit = () => {
        window.ApiClient.put(`/policy-providers/${policyProvider.Id}`, {
            ...policyProvider
        }).then(_ => {
            window.ApiClient.get("/policy-providers").then(res => {
                dispatch({
                    type: SET_POLICY_PROVIDERS,
                    payload: res.data,
                })
            }).then(back);
        });
    };

    console.log(policyProvider);

    return (
        <div className="modal" >
            <Dialog open={true} onClose={back}>
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
                    <Button onClick={back}>Cancel</Button>
                    <Button onClick={submit}>Update</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default EditPolicyProvider;
