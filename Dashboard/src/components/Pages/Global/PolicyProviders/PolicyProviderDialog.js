import React, {  } from 'react';
import { useHistory, Link } from "react-router-dom";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
} from '@mui/material';

import { GoBack } from 'Utils/Routing';
import RichTextEditor from 'Components/Widgets/RichTextEditor';

import './PolicyProviderDialog.css';

export const PolicyProviderDialog = ({ policyProvider, setPolicyProvider, submitLabel, submitHandler }) => {
    let history = useHistory();
    let goBack = GoBack(history);

    const handlers = {
        SetName:    (event) => { setPolicyProvider({ ...policyProvider, Name: event.target.value, }); },
        SetPricing: (html) => { setPolicyProvider({ ...policyProvider, Pricing: html, }); },
    };

    return (
        <div className="modal" >
            <Dialog open={true} onClose={goBack} fullWidth={true} maxWidth={'md'}>
                <form onSubmit={submitHandler}>
                    <DialogTitle>{submitLabel} Policy Provider</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Enter policy provider details
                        </DialogContentText>

                        <br />
                        <TextField value    = {policyProvider.Name}
                                   onChange = {handlers.SetName}
                                   margin   = "dense"
                                   id       = "name"
                                   label    = "Name"
                                   type     = "text"
                                   autoFocus fullWidth />

                        &nbsp;
                        <DialogContentText>
                            Pricing
                        </DialogContentText>
                        
                        <RichTextEditor initialValue = {policyProvider.Pricing}
                                        onChange     = {handlers.SetPricing} />

                        <Link to={{ pathname: `/policy-providers/id/${policyProvider.Id}/provider-charges` }}>Provider charges</Link>

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={goBack}>Cancel</Button>
                        <Button type='submit' onClick={submitHandler}>{submitLabel}</Button>
                    </DialogActions>
                </form>
            </Dialog>
            </div>
    );
};

export default PolicyProviderDialog;
