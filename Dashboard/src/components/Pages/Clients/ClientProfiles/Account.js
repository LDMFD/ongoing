import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { getAuth, sendSignInLinkToEmail } from "firebase/auth";
import {
    Button,
} from '@mui/material';

import { Context } from 'State'
import { ONGOING_DASHBOARD_URL } from 'App';

function SendSignInLink(email) {
    const actionCodeSettings = {
        url: ONGOING_DASHBOARD_URL,
        handleCodeInApp: true,    // This must be true according to the docs.
    };
    
    const auth = getAuth();

    sendSignInLinkToEmail(auth, email, actionCodeSettings).then(() => {
        alert("Email sent");
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        alert(`${errorCode}, ${errorMessage}`);
    });
}

const ClientAccountPage = () => {
    const [state] = useContext(Context);

    let { clientId } = useParams();

    let client = state.Clients.find(c => c.Id === clientId);
    console.log(client);

    return (
        <div>
            <h1>{client.Identity.Surname}, {client.Identity.Forenames}</h1>
            <p>
                Email: <a href={`mailto:${client.Identity.Email}`} target='_blank' rel='noreferrer'>{client.Identity.Email}</a>
            </p>
            <p>
                <Button onClick={SendSignInLink.bind(null, client.Identity.Email)}>
                    Send sign-in link
                </Button>
            </p>
        </div>
    );
}

export default ClientAccountPage;
