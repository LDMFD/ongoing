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

import { GoBack } from 'Utils';

export const FundDialog = ({ fund, setFund, submitLabel, submitHandler }) => {
    let history = useHistory();
    let goBack = GoBack(history);

    const handlers = {
        SetName:         (event) => { setFund({ ...fund, Name:        event.target.value, }); },
        EditWeightedFee: (event) => { setFund({ ...fund, WeightedFee: parseFloat(event.target.value) }); },
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

                    <TextField value    = {fund.WeightedFee}
                               onChange = {handlers.EditWeightedFee}
                               margin   = "dense"
                               id       = "weightedFee"
                               label    = "Weighted OCF"
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
