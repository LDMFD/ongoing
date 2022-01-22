import React, { useEffect, useContext, useCallback, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
    Button,
    MenuItem,
    TextField,
    Select,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';

import { Context } from 'StateProvider'
import { SET_OPERATORS } from 'Reducer';
import { GoBack } from 'Utils';

const EditOperator = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ , dispatch] = useContext(Context);
    let [ operator, setOperator ] = useState({
        Name: '',
        Type: '',
        Fee: 0,
    });

    let { operatorId } = useParams();
    operatorId = parseInt(operatorId);

    const getOperators = useCallback(() => {
        window.ApiClient.get("/operators").then(res => {
            dispatch({
                type: SET_OPERATORS,
                payload: res.data,
            });
            setOperator(res.data.Operators.find(c => c.Id === operatorId));
        });
     }, [ operatorId, dispatch ]);

    useEffect(() => {
        getOperators();
    }, [ getOperators ]);

    const handleChangeName = (event) => {
        setOperator({
            ...operator,
            Name: event.target.value,
        });
    }
    const handleChangeType = (event) => {
        setOperator({
            ...operator,
            Type: event.target.value,
        });
    }

    const handleChangeFee = (event) => {
        setOperator({
            ...operator,
            Fee: parseFloat(event.target.value),
        });
    }

    const submit = (e) => {
        e.preventDefault();
        window.ApiClient.put(`/operators/${operator.Id}`, {
            ...operator
        }).then(_ => {
            window.ApiClient.get("/operators").then(res => {
                dispatch({
                    type: SET_OPERATORS,
                    payload: res.data,
                })
            }).then(() => {
                goBack();
            });
        });
        return false;
    };

    return (
        <div className="modal" >
            <Dialog open={true} onClose={goBack}>
                <DialogTitle>Edit Operator</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter operator details
                    </DialogContentText>

                    <TextField value    = {operator.Name}
                               onChange = {handleChangeName}
                               margin   = "dense"
                               id       = "name"
                               label    = "Name"
                               type     = "text"
                               autoFocus fullWidth />

                    <Select value    = {operator.Type}
                            onChange = {handleChangeType}
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

                    <TextField value    = {operator.Fee}
                               onChange = {handleChangeFee}
                               margin   = "dense"
                               id       = "fee"
                               label    = "Fee"
                               type     = "number"
                               fullWidth />

                </DialogContent>
                <DialogActions>
                    <Button onClick={goBack}>Cancel</Button>
                    <Button onClick={submit}>Update</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default EditOperator;
