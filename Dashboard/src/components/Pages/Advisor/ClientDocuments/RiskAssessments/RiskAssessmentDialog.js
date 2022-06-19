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
    FormControl,
    InputLabel,
} from '@mui/material';

import { Context } from 'State/StateProvider'
import { GoBack } from 'Utils/Routing';
import FileUploader from 'Components/Library/FileHandling/FileUploader';
import { DateSelector } from 'Components/Library/DateSelector/DateSelector';

export const RiskAssessmentDialog = ({ assessment, setAssessment, submitLabel, submitHandler }) => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state ] = useContext(Context);

    const handlers = {
        SetProviderId: (event) => {
            setAssessment({
                ...assessment,
                RiskProviderId: event.target.value,
            });
        },
        SetLevelId: (event) => {
            setAssessment({
                ...assessment,
                RiskLevelId: event.target.value,
            });
        },
        SetCompleted: (event) => {
            setAssessment({
                ...assessment,
                Completed: event,
            });
        },
    };
    
    return (
        <Dialog open={true} onClose={goBack}>
            <form onSubmit={submitHandler}>
                <DialogTitle>{submitLabel} RiskAssessment</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter risk assessment details
                    </DialogContentText>

                    <FormControl sx={{ width: `30ch` }}>
                        <InputLabel id='ong-select-provider'>Assessment Provider</InputLabel>
                        <Select labelId  = 'ong-select-provider'
                                value    = {assessment.RiskProviderId || ''}
                                onChange = {handlers.SetProviderId}
                                margin   = "dense"
                                id       = "type"
                                label    = "Type"
                                type     = "text"
                                fullWidth autoFocus>
                            <MenuItem value='select'>Select assessment provider</MenuItem>
                            {state.Entities.RiskProviders.map(t => (
                                <MenuItem value={t.Id} key={t.Id}>
                                    {t.Name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Select value    = {assessment.RiskLevelId}
                            onChange = {handlers.SetLevelId}
                            margin   = "dense"
                            id       = "level"
                            label    = "Level"
                            type     = "text"
                            disabled = {!assessment.RiskProviderId?.length}
                            fullWidth>
                        <MenuItem value='select'>Select level</MenuItem>
                        {state.Entities.RiskLevels
                            .filter(l => l.RiskProviderId === assessment.RiskProviderId)
                            .map(l => (
                            <MenuItem value={l.Id} key={l.Id}>
                                {l.Level} - {l.Label}
                            </MenuItem>
                        ))}
                    </Select>

                    <DateSelector selected = {assessment.Completed}
                                  onChange = {handlers.SetCompleted} />

                    <FileUploader file         = {assessment.Questionnaire}
                                  stateUpdater = {setAssessment}
                                  state        = {assessment}
                                  property     = 'Questionnaire' />

                </DialogContent>
                <DialogActions>
                    <Button onClick={goBack}>Cancel</Button>
                    <Button type='submit' onClick={submitHandler}>{submitLabel}</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default RiskAssessmentDialog;
