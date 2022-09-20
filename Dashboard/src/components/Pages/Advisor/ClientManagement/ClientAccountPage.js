import React, { useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Button,
    Toolbar,
} from '@mui/material';

import { Context } from 'State'
import SendSignInLink from "Components/Library/Auth/AuthEmailer";

const ClientAccountPage = () => {
    const [state] = useContext(Context);

    let { clientId } = useParams();

    let client = state.Clients.find(c => c.Id === clientId);

    return (
        <div>
            <h1>{client.Identity.Surname}, {client.Identity.Forenames}</h1>
            <p>
                Email: <a href={`mailto:${client.Identity.Email}`} target='_blank' rel='noreferrer'>{client.Identity.Email}</a>
                <br /><br />
                Fee: {client.Fee}%
            </p>

            <Toolbar className="breadcrumb-action">
                <Link to={{ pathname: `/clients/id/${client.Id}/edit` }}><Button>Edit client</Button></Link>
                
                <Button onClick={SendSignInLink.bind(null, client.Identity.Email)}>
                    Send sign-in link
                </Button>
            </Toolbar>
        </div>
    );
}

export default ClientAccountPage;
