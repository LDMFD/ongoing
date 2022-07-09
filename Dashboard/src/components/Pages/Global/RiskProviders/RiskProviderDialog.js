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

export const RiskProviderDialog = ({ riskProvider, setRiskProvider, submitLabel, submitHandler }) => {
    let history = useHistory();
    let goBack = GoBack(history);

    const handlers = {
        SetName: (event) => { setRiskProvider({ ...riskProvider, Name: event.target.value, }); },
    };

    return (
        <div className="modal" >
            <Dialog open={true} onClose={goBack} fullWidth={true} maxWidth={'md'}>
                <form onSubmit={submitHandler}>
                    <DialogTitle>{submitLabel} Risk Provider</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Enter risk provider details
                        </DialogContentText>

                        <br />
                        <TextField value    = {riskProvider.Name}
                                   onChange = {handlers.SetName}
                                   margin   = "dense"
                                   id       = "name"
                                   label    = "Name"
                                   type     = "text"
                                   autoFocus fullWidth />

                        {submitLabel.toLowerCase() === 'update' &&  // hack
                            <Link to={{ pathname: `/risk-providers/id/${riskProvider.Id}/risk-levels` }}>Risk Provider Levels</Link>
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

export default RiskProviderDialog;
