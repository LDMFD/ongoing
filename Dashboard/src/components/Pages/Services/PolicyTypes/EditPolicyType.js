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

import { Context } from 'Store'
import { SET_POLICY_TYPES } from 'Reducer';
import { GoBack } from 'Utils';

const EditPolicyType = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ , dispatch] = useContext(Context);
    let [ policyType, setPolicyType ] = useState({
        Name: '',
    });

    let { policyTypeId } = useParams();
    policyTypeId = parseInt(policyTypeId);

    const getPolicyTypes = useCallback(() => {
        window.ApiClient.get("/policy-types").then(res => {
            dispatch({
                type: SET_POLICY_TYPES,
                payload: res.data,
            });
            setPolicyType(res.data.PolicyTypes.find(c => c.Id === policyTypeId));
        });
     }, [ policyTypeId, dispatch ]);

    useEffect(() => {
        getPolicyTypes();
    }, [ getPolicyTypes ]);

    const handleChangeName = (event) => {
        setPolicyType({
            ...policyType,
            Name: event.target.value,
        });
    }

    const submit = (e) => {
        e.preventDefault();
        window.ApiClient.put(`/policy-types/${policyType.Id}`, {
            ...policyType
        })
        .then(() => {
            goBack();
        })
        .then(_ => {
            window.ApiClient.get("/policy-types").then(res => {
                dispatch({
                    type: SET_POLICY_TYPES,
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
                    <DialogTitle>Edit Policy Type</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Enter policy type
                        </DialogContentText>

                        <TextField value    = {policyType.Name}
                                onChange = {handleChangeName}
                                margin   = "dense"
                                id       = "name"
                                label    = "Name"
                                type     = "text"
                                autoFocus fullWidth />

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={goBack}>Cancel</Button>
                        <Button type='submit'>Update</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    );
}

export default EditPolicyType;
