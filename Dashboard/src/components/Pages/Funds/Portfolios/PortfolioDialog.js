import React, { useContext } from 'react';
import { useHistory } from "react-router-dom";

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';

import { Context } from 'Store'

export const GoBack = history => e => {
    if (e) {
        e.stopPropagation();
    }
    history.goBack();
};

export const PortfolioDialog = ({ portfolio, setPortfolio, submitLabel, submitHandler }) => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state ] = useContext(Context);

    if (!state.operators.length) {
        return null;
    }

    const handlers = {
        EditName:        (event) => { setPortfolio({ ...portfolio, Name:        event.target.value }); },
        EditWeightedFee: (event) => { setPortfolio({ ...portfolio, WeightedFee: parseFloat(event.target.value) }); },
        EditExAnteFee:   (event) => { setPortfolio({ ...portfolio, ExAnteFee:   parseFloat(event.target.value) }); },
        SetOperatorId:   (event) => { setPortfolio({ ...portfolio, OperatorId:  parseInt(event.target.value), }); },
    };
    
    return (
        <div className="modal" >
            <Dialog open={true} onClose={goBack}>
                <DialogTitle>{submitLabel} Portfolio</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter portfolio details
                    </DialogContentText>

                    <TextField value    = {portfolio.Name}
                            onChange = {handlers.EditName}
                            margin   = "dense"
                            id       = "name"
                            label    = "Name"
                            type     = "text"
                            autoFocus fullWidth />

                    <Select value    = {portfolio.OperatorId}
                            onChange = {handlers.SetOperatorId}
                            margin   = "dense"
                            id       = "type"
                            label    = "Operator"
                            type     = "text"
                            fullWidth>
                        <MenuItem value='select'>Select operator</MenuItem>
                        {state.operators.map(t => (
                            <MenuItem value={t.Id} key={t.Id}>
                                {t.Name}
                            </MenuItem>
                        ))}
                    </Select>

                    <TextField value    = {portfolio.WeightedFee}
                            onChange = {handlers.EditWeightedFee}
                            margin   = "dense"
                            id       = "weightedFee"
                            label    = "Weighted OCF"
                            type     = "number"
                            fullWidth />

                    <TextField value    = {portfolio.ExAnteFee}
                            onChange = {handlers.EditExAnteFee}
                            margin   = "dense"
                            id       = "exAnteFee"
                            label    = "Ex Ante Fee"
                            type     = "number"
                            fullWidth />

                </DialogContent>
                <DialogActions>
                    <Button onClick={goBack}>Cancel</Button>
                    <Button onClick={handlers.Submit}>{submitLabel}</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default PortfolioDialog;
