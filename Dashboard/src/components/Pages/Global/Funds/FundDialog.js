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

export const FundDialog = ({ fund, setFund, submitLabel, submitHandler }) => {
    let history = useHistory();
    let goBack = GoBack(history);

    const handlers = {
        SetName:         (event) => { setFund({ ...fund, Name:        event.target.value, }); },
        EditOcfFee:      (event) => { setFund({ ...fund, OcfFee: parseFloat(event.target.value) }); },
        EditExAnteFee:   (event) => { setFund({ ...fund, ExAnteFee:   parseFloat(event.target.value) }); },
    };
    
    return (
        <Dialog open={true} onClose={goBack}>
            <form onSubmit={submitHandler}>
                <DialogTitle>{submitLabel} Holding</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter fund details
                    </DialogContentText>

                    <TextField value    = {fund.Name}
                               onChange = {handlers.SetName}
                               margin   = "dense"
                               id       = "name"
                               label    = "Name"
                               type     = "text"
                               variant  = "standard"
                               autoFocus
                               fullWidth />

                    <TextField value    = {fund.OcfFee}
                               onChange = {handlers.EditOcfFee}
                               margin   = "dense"
                               id       = "ocfFee"
                               label    = "OCF Fee"
                               type     = "number"
                               fullWidth />

                    <TextField value    = {fund.ExAnteFee}
                               onChange = {handlers.EditExAnteFee}
                               margin   = "dense"
                               id       = "exAnteFee"
                               label    = "Ex Ante Fee"
                               type     = "number"
                               fullWidth />

                </DialogContent>
                <DialogActions>
                    <Button onClick={goBack}>Cancel</Button>
                    <Button type='submit' onClick={submitHandler}>{submitLabel}</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default FundDialog;
