import React, { useEffect, useContext, useCallback, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { Context } from 'Store'
import { SET_POLICY_TYPES } from 'Reducer';

const EditPolicyType = () => {
    let history = useHistory();

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

    let back = e => {
        if (e) {
            e.stopPropagation();
        }
        history.goBack();
    };

    const submit = () => {
        window.ApiClient.put(`/policy-types/${policyType.Id}`, {
            ...policyType
        }).then(_ => {
            window.ApiClient.get("/policy-types").then(res => {
                dispatch({
                    type: SET_POLICY_TYPES,
                    payload: res.data,
                })
            }).then(back);
        });
    };

    return (
        <div className="modal" >
            <Dialog open={true} onClose={back}>
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
                    <Button onClick={back}>Cancel</Button>
                    <Button onClick={submit}>Update</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default EditPolicyType;
