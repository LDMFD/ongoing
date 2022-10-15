import React, {  } from 'react';
import { useHistory,  } from "react-router-dom";
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

export const PolicyTypeDialog = ({ policyType, setPolicyType, submitLabel, submitHandler }) => {
    let history = useHistory();
    let goBack = GoBack(history);

    const handlers = {
        SetName: (event) => { setPolicyType({ ...policyType, Name: event.target.value, }); },
    };
    
    return (
        <div className="modal" >
            <Dialog open={true} onClose={goBack}>
                <form onSubmit={submitHandler}>
                    <DialogTitle>{submitLabel} Policy Type</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Enter policy type
                        </DialogContentText>

                        <TextField value    = {policyType.Name}
                                   onChange = {handlers.SetName}
                                   margin   = "dense"
                                   id       = "name"
                                   label    = "Name"
                                   type     = "text"
                                   autoFocus fullWidth />

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

export default PolicyTypeDialog;
