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

import { Context } from 'State/StateProvider'
import { GoBack } from 'Utils/Routing';

const ProviderDiscountDialog = ({ providerDiscount, setProviderDiscount, submitLabel, submitHandler }) => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, ] = useContext(Context);

    const handlers = {
        SetProviderId: (event) => { setProviderDiscount({ ...providerDiscount, PolicyProviderId: event.target.value, }); },
        SetDiscount:   (event) => { setProviderDiscount({ ...providerDiscount, Discount: parseFloat(event.target.value), }); },
    };

    return (
        <Dialog open={true} onClose={goBack}>
            <form onSubmit={submitHandler}>
                <DialogTitle>{submitLabel} Provider Discount</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter provider discount
                    </DialogContentText>

                    <FormControl sx={{ width: `30ch` }}>
                        <InputLabel id='ong-select-provider'>Provider</InputLabel>
                        <Select labelId  = 'ong-select-provider'
                                value    = {providerDiscount.PolicyProviderId || ''}
                                onChange = {handlers.SetProviderId}
                                margin   = "dense"
                                id       = "type"
                                label    = "Type"
                                type     = "text"
                                fullWidth>
                            <MenuItem value='select'>Select provider</MenuItem>
                            {state.Resources.PolicyProviders.map(t => (
                                <MenuItem value={t.Id} key={t.Id}>
                                    {t.Name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField value    = {providerDiscount.Discount}
                               onChange = {handlers.SetDiscount}
                               margin   = "dense"
                               id       = "providerDiscount"
                               label    = "Discounted platform fee"
                               type     = "number"
                               fullWidth />

                </DialogContent>
                <DialogActions>
                    <Button onClick={goBack}>Cancel</Button>
                    <Button type='submit'>{submitLabel}</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export default ProviderDiscountDialog;
