import React, {  } from 'react';
import { useHistory,  } from "react-router-dom";
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

import { GoBack } from 'Utils/Routing';
import { OPERATOR_TYPES } from './OperatorTypes';

export const OperatorDialog = ({ operator, setOperator, submitLabel, submitHandler }) => {
    let history = useHistory();
    let goBack = GoBack(history);

    const handlers = {
        SetName: (event) => { setOperator({ ...operator, Name: event.target.value, }); },
        SetType: (event) => { setOperator({ ...operator, Type: event.target.value, }); },
        SetFee:  (event) => { setOperator({ ...operator, Fee:  parseFloat(event.target.value), }); },
    };
    
    return (
        <div className="modal" >
            <Dialog open={true} onClose={goBack}>
                <form onSubmit={submitHandler}>
                    <DialogTitle>{submitLabel} Portfolio Operator</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Enter operator details
                        </DialogContentText>

                        <TextField value    = {operator.Name}
                                   onChange = {handlers.SetName}
                                   margin   = "dense"
                                   id       = "name"
                                   label    = "Name"
                                   type     = "text"
                                   autoFocus fullWidth />

                        <Select value    = {operator.Type}
                                onChange = {handlers.SetType}
                                margin   = "dense"
                                id       = "type"
                                label    = "Type"
                                type     = "text"
                                fullWidth>
                            <MenuItem value='select'>Select type</MenuItem>
                            {Object.entries(OPERATOR_TYPES).map(([ id, label ]) => (
                                <MenuItem value={id} key={id}>
                                    {label}
                                </MenuItem>
                            ))}
                        </Select>

                        <TextField value    = {operator.Fee}
                                   onChange = {handlers.SetFee}
                                   margin   = "dense"
                                   id       = "fee"
                                   label    = "Fee"
                                   type     = "number"
                                   fullWidth />

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

export default OperatorDialog;
