import React, {  } from 'react';
import { useHistory,  } from "react-router-dom";

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

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
        <div className="modal" >
            <Dialog open={true} onClose={goBack}>
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
                    <Button onClick={submitHandler}>{submitLabel}</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default FundDialog;
