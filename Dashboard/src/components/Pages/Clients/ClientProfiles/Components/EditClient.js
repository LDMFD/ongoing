import React, { useContext, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { Context } from 'Store'
import { POPULATE_CLIENT } from 'Reducer';

const EditClient = () => {
    let history = useHistory();

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

    let back = e => {
        if (e) {
            console.log(e);
            e.stopPropagation();
        }
        history.goBack();
    };

    const getClientDetail = async () => {
        return window.ApiClient.get(`/clients/${clientId}`).then(res => {
            dispatch({
                type: POPULATE_CLIENT,
                payload: res.data,
            });
        });
    };

    const submit = () => {
        window.ApiClient.put(`/clients/${client.Id}`, {
            Surname: client.Surname,
            Forenames: client.Forenames,
        }).then(async () => {
            await getClientDetail();
            back();
        });
    };

    return client && (
        <div className="modal" >
            <Dialog open={true} onClose={back}>
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
                    <Button onClick={back}>Cancel</Button>
                    <Button onClick={submit}>Update</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default EditClient;
