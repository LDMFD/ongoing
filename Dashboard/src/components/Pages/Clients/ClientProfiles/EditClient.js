import React, { useContext, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';

import { Context } from 'Store'
import { POPULATE_CLIENT } from 'Reducer';
import { GoBack } from 'Utils';

const EditClient = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch] = useContext(Context);
    let [ client, setClient ] = useState(null);

    let { clientId } = useParams();
    clientId = parseInt(clientId);

    if (client == null) {
        let c = state.clients.find(c => c.Id === clientId);
        if (c) {
            setClient(c);
            return;
        }
    }

    const handleChangeSurname = (event) => {
        setClient({
            ...client,
            Surname: event.target.value,
        });
    }
    const handleChangeForenames = (event) => {
        setClient({
            ...client,
            Forenames: event.target.value,
        });
    }

    const getClientDetail = async () => {
        return window.ApiClient.get(`/clients/${clientId}`).then(res => {
            dispatch({
                type: POPULATE_CLIENT,
                payload: res.data,
            });
        });
    };

    const submit = (e) => {
        e.preventDefault();
        window.ApiClient.put(`/clients/${client.Id}`, {
            Surname: client.Surname,
            Forenames: client.Forenames,
        }).then(async () => {
            await getClientDetail();
        })
        .then(() => {
            goBack();
        });
        return false;
   };

    return client && (
        <div className="modal" >
            <Dialog open={true} onClose={goBack}>
                <form onSubmit={submit}>
                    <DialogTitle>Edit Client</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Enter client details
                        </DialogContentText>

                        <TextField value    = {client.Surname}
                                onChange = {handleChangeSurname}
                                margin   = "dense"
                                id       = "surname"
                                label    = "Surname"
                                type     = "text"
                                variant  = "standard"
                                autoFocus
                                fullWidth />

                        <TextField value    = {client.Forenames}
                                onChange = {handleChangeForenames}
                                margin  = "dense"
                                id      = "forenames"
                                label   = "Forenames"
                                type    = "text"
                                variant = "standard"
                                fullWidth />

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={goBack}>Cancel</Button>
                        <Button type='submit'>Update</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    );
}

export default EditClient;
