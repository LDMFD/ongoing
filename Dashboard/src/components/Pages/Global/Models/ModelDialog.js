import React, { useContext } from 'react';
import { useHistory } from "react-router-dom";
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

import { Context } from 'State/StateProvider'
import { GoBack } from 'Utils/Routing';
import FileUploader from 'Components/Library/FileHandling/FileUploader';
import { DateSelector } from 'Components/Library/DateSelector/DateSelector';

export const ModelDialog = ({ model, setModel, submitLabel, submitHandler, includeFiles }) => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state ] = useContext(Context);

    const handlers = {
        EditName: (event) => {
            setModel({
                ...model,
                Name: event.target.value
            });
        },
        EditWeightedOcfFee: (event) => {
            setModel({
                ...model,
                WeightedOcfFee: parseFloat(event.target.value)
            });
        },
        EditWeightedExAnteFee: (event) => {
            setModel({
                ...model,
                WeightedExAnteFee: parseFloat(event.target.value)
            });
        },
        SetOperatorId: (event) => {
            setModel({
                ...model,
                OperatorId: event.target.value,
            });
        },
        SetModified: (event) => {
            setModel({
                ...model,
                Modified: event,
            });
        },
    };
    
    return (
        <Dialog open={true} onClose={goBack}>
            <form onSubmit={submitHandler}>
                <DialogTitle>{submitLabel} Model</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter model details
                    </DialogContentText>

                    <TextField value = {model.Name}
                            onChange = {handlers.EditName}
                            margin   = "dense"
                            id       = "name"
                            label    = "Name"
                            type     = "text"
                            autoFocus fullWidth />

                    <Select value    = {model.OperatorId}
                            onChange = {handlers.SetOperatorId}
                            margin   = "dense"
                            id       = "type"
                            label    = "Operator"
                            type     = "text"
                            fullWidth>
                        <MenuItem value='select'>Select operator</MenuItem>
                        {state.Entities.Operators.map(t => (
                            <MenuItem value={t.Id} key={t.Id}>
                                {t.Name}
                            </MenuItem>
                        ))}
                    </Select>

                    <TextField value = {model.WeightedOcfFee}
                            onChange = {handlers.EditWeightedOcfFee}
                            margin   = "dense"
                            id       = "ocfFee"
                            label    = "Weighted OCF Fee"
                            type     = "number"
                            fullWidth />

                    <TextField value = {model.WeightedExAnteFee}
                            onChange = {handlers.EditWeightedExAnteFee}
                            margin   = "dense"
                            id       = "exAnteFee"
                            label    = "Weighted Ex Ante Fee"
                            type     = "number"
                            fullWidth />

                    <DateSelector label    = 'Modification date'
                                  selected = {model.Modified}
                                  onChange = {handlers.SetModified} />

                    <FileUploader file         = {model.File}
                                  stateUpdater = {setModel}
                                  state        = {model} />

                </DialogContent>
                <DialogActions>
                    <Button onClick={goBack}>Cancel</Button>
                    <Button type='submit'>{submitLabel}</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default ModelDialog;
