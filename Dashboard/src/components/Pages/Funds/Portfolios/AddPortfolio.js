import React, { useContext, useState, useCallback, useEffect } from 'react';
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
import { SET_PORTFOLIOS, SET_OPERATORS } from 'Reducer';

const AddPortfolio = () => {
    let history = useHistory();
    const [ state, dispatch] = useContext(Context);

    let [ portfolio, setPortfolio ] = useState({
        Name: '',
        OperatorId: 'select',
        WeightedFee: '',
        ExAnteFee: '',
    });

    let back = e => {
        if (e) {
            e.stopPropagation();
        }
        history.goBack();
    };

    const getOperators = useCallback(() => {
        window.ApiClient.get("/operators").then(res => {
            dispatch({
                type: SET_OPERATORS,
                payload: res.data,
            });
        });
    }, [ dispatch ]);

    useEffect(() => {
        getOperators();
    }, [ getOperators ]);

    if (!state.operators.length) {
        return null;
    }

    const submit = () => {
        window.ApiClient.post("/portfolios", {
            ...portfolio
        }).then(_ => {
            window.ApiClient.get("/portfolios").then(res => {
                dispatch({
                    type: SET_PORTFOLIOS,
                    payload: res.data,
                })
            }).then(back);;
        });
    };

    const onEditName        = (event) => { setPortfolio({ ...portfolio, Name:        event.target.value }); }
    const onEditWeightedFee = (event) => { setPortfolio({ ...portfolio, WeightedFee: parseFloat(event.target.value) }); }
    const onEditExAnteFee   = (event) => { setPortfolio({ ...portfolio, ExAnteFee:   parseFloat(event.target.value) }); }
    const onSetOperatorId   = (event) => { setPortfolio({ ...portfolio, OperatorId:  parseInt(event.target.value), }); }

    return (
        <div className="modal" >
            <Dialog open={true} onClose={back}>
                <DialogTitle>Add Portfolio</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter portfolio details
                    </DialogContentText>

                    <TextField value    = {portfolio.Name}
                               onChange = {onEditName}
                               margin   = "dense"
                               id       = "name"
                               label    = "Name"
                               type     = "text"
                               autoFocus fullWidth />

                    <Select value    = {portfolio.OperatorId}
                            onChange = {onSetOperatorId}
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
                               onChange = {onEditWeightedFee}
                               margin   = "dense"
                               id       = "weightedFee"
                               label    = "Weighted OCF"
                               type     = "number"
                               fullWidth />

                    <TextField value    = {portfolio.ExAnteFee}
                               onChange = {onEditExAnteFee}
                               margin   = "dense"
                               id       = "exAnteFee"
                               label    = "Ex Ante Fee"
                               type     = "number"
                               fullWidth />

                </DialogContent>
                <DialogActions>
                    <Button onClick={back}>Cancel</Button>
                    <Button onClick={submit}>Add</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default AddPortfolio;
