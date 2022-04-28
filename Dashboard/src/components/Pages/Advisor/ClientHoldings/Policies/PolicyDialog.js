import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
} from '@mui/material';
import RichTextEditor from 'Components/Library/RichTextEditor';

import { Context } from 'State/StateProvider'
import { GoBack } from 'Utils/Routing';
import FileUploader from 'Components/Library/FileHandling/FileUploader';

const PolicyDialog = ({ policy, setPolicy, submitLabel, submitHandler }) => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, ] = useContext(Context);

    const handlers = {
        SetExternalId:   (event) => { setPolicy({ ...policy, ExternalId:           event.target.value }); },
        SetDiscount:     (event) => { setPolicy({ ...policy, PlatformDiscount:     parseFloat(event.target.value), }); },
        SetMonthlies:    (event) => { setPolicy({ ...policy, MonthlyContributions: parseInt(event.target.value), }); },
        SetStartValue:   (event) => { setPolicy({ ...policy, StartValue:           parseInt(event.target.value), }); },
        SetEndValue:     (event) => { setPolicy({ ...policy, EndValue:             parseInt(event.target.value), }); },
        SetPolicyTypeId: (event) => { setPolicy({ ...policy, PolicyTypeId:         event.target.value, }); },
        SetProviderId:   (event) => { setPolicy({ ...policy, PolicyProviderId:     event.target.value, }); },
        SetNotes:        (html) => { setPolicy({ ...policy,  Notes:                html, }); },
    };

    return (
        <Dialog open={true} onClose={goBack}>
            <form onSubmit={submitHandler}>
                <DialogTitle>{submitLabel} Policy</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter policy details
                    </DialogContentText>

                    <TextField value    = {policy.ExternalId}
                               onChange = {handlers.SetExternalId}
                               margin   = "dense"
                               id       = "externalId"
                               label    = "Policy number"
                               type     = "text"
                               autoFocus fullWidth />

                    <TextField value    = {policy.PlatformDiscount}
                               onChange = {handlers.SetDiscount}
                               margin   = "dense"
                               id       = "platformDiscount"
                               label    = "Platform Discount"
                               type     = "number"
                               fullWidth />

                    <TextField value    = {policy.MonthlyContributions}
                               onChange = {handlers.SetMonthlies}
                               margin   = "dense"
                               id       = "monthlyContributions"
                               label    = "Monthly Contribution"
                               type     = "number"
                               fullWidth />

                    <TextField value    = {policy.StartValue}
                               onChange = {handlers.SetStartValue}
                               margin   = "dense"
                               id       = "startValue"
                               label    = "Start Value"
                               type     = "number"
                               fullWidth />

                    <TextField value    = {policy.EndValue}
                               onChange = {handlers.SetEndValue}
                               margin   = "dense"
                               id       = "endValue"
                               label    = "End Value"
                               type     = "number"
                               fullWidth />

                    <FormControl sx={{ width: `30ch` }}>
                        <InputLabel id='ong-select-module'>Type</InputLabel>
                        <Select labelId  = 'ong-select-module'
                                value    = {policy.PolicyTypeId || ''}
                                onChange = {handlers.SetPolicyTypeId}
                                margin   = "dense"
                                id       = "type"
                                label    = "Type"
                                type     = "text"
                                fullWidth>
                            <MenuItem value='select'>Select policy type</MenuItem>
                            {state.Entities.PolicyTypes.map(t => (
                                <MenuItem value={t.Id} key={t.Id}>
                                    {t.Name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    &nbsp;

                    <FormControl sx={{ width: `30ch` }}>
                        <InputLabel id='ong-select-provider'>Provider</InputLabel>
                        <Select labelId  = 'ong-select-provider'
                                value    = {policy.PolicyProviderId || ''}
                                onChange = {handlers.SetProviderId}
                                margin   = "dense"
                                id       = "type"
                                label    = "Type"
                                type     = "text"
                                fullWidth>
                            <MenuItem value='select'>Select provider</MenuItem>
                            {state.Entities.PolicyProviders.map(t => (
                                <MenuItem value={t.Id} key={t.Id}>
                                    {t.Name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <RichTextEditor initialValue = {policy.Notes || ''}
                                    onChange     = {handlers.SetNotes} />

                    <FileUploader file         = {policy.File}
                                  stateUpdater = {setPolicy}
                                  state        = {policy} />

                </DialogContent>
                <DialogActions>
                    <Button onClick={goBack}>Cancel</Button>
                    <Button type='submit'>{submitLabel}</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export default PolicyDialog;
