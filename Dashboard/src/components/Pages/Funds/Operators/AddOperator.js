import React, { useContext, useState } from 'react';
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
import { SET_OPERATORS } from 'Reducer';
import { GoBack } from 'Utils';

const AddOperator = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ , dispatch] = useContext(Context);

    let [ name, setName ] = useState('');
    let [ type, setType ] = useState('');
    let [ fee, setFee ] = useState(0.0);

    const submit = (e) => {
        e.preventDefault();
        window.ApiClient.post("/operators", {
            Name: name,
            Type: type,
            Fee: fee,
        })
        .then(() => {
            goBack();
        })
        .then(_ => {
            window.ApiClient.get("/operators").then(res => {
                dispatch({
                    type: SET_OPERATORS,
                    payload: res.data,
                })
            });
        });
        return false;
    };

    let handleFeeChange = (v) => {
        let fee = parseFloat(v);
        setFee(fee);
    }

    return (
        <div className="modal" >
            <Dialog open={true} onClose={goBack}>
                <form onSubmit={submit}>
                    <DialogTitle>Add Operator</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Enter operator details
                        </DialogContentText>

                        <TextField value    = {name}
                                onChange = {(e) => setName(e.target.value)}
                                margin   = "dense"
                                id       = "name"
                                label    = "Name"
                                type     = "text"
                                autoFocus fullWidth />

                        <Select value    = {type}
                                onChange = {(e) => setType(e.target.value)}
                                margin   = "dense"
                                id       = "type"
                                label    = "Type"
                                type     = "text"
                                fullWidth>
                            <MenuItem value='dim'>DIM</MenuItem>
                            <MenuItem value='firm'>Firm</MenuItem>
                            <MenuItem value='individual'>Individual</MenuItem>
                            <MenuItem value='none'>None</MenuItem>
                        </Select>

                        <TextField value    = {fee}
                                onChange = {(e) => handleFeeChange(e.target.value)}
                                margin   = "dense"
                                id       = "fee"
                                label    = "Fee"
                                type     = "number"
                                fullWidth />

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={goBack}>Cancel</Button>
                        <Button type='submit'>Add</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    );
}

export default AddOperator;
