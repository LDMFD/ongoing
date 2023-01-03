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
import RichTextEditor from 'Components/Library/RichTextEditor/RichTextEditor';

import './PolicyProviderDialog.css';

export const PolicyProviderDialog = ({ policyProvider, setPolicyProvider, submitLabel, submitHandler }) => {
    let history = useHistory();
    let goBack = GoBack(history);

    const handlers = {
        SetName:          (event) => { setPolicyProvider({ ...policyProvider, Name: event.target.value, }); },
        SetPricing:       (html) => { setPolicyProvider({ ...policyProvider, Pricing: html,       }); },
        SetCustomPricing: (html) => { setPolicyProvider({ ...policyProvider, CustomPricing: html, }); },
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

                        <RichTextEditor label        = 'Pricing'
                                        initialValue = {policyProvider.Pricing}
                                        onChange     = {handlers.SetPricing} />
                        <small>Use <code>{'{ table }'}</code> to embed the charges table.</small>
                        <br /><br />

                        <RichTextEditor label        = 'Custom Pricing'
                                        initialValue = {policyProvider.CustomPricing}
                                        onChange     = {handlers.SetCustomPricing} />
                        <small>Use <code>{'{ charge }'}</code> to embed the discount.</small>

                        {submitLabel === 'Add' ?
                            <p>Create provider first to edit charges</p>
                        :
                            <p>
                                Switch to <Link to={{ pathname: `/policy-providers/id/${policyProvider.Id}/provider-charges` }}>Charges table</Link>.
                            </p>
                        }

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={goBack}>Cancel</Button>
                        <Button type='submit'>{submitLabel}</Button>
                    </DialogActions>
                </form>
            </Dialog>
            </div>
    );
};

export default PolicyProviderDialog;
