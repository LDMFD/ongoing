import React, { useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Button,
    Toolbar,
    Link as MuiLink,
} from '@mui/material';

import { Context } from 'State'
import SendSignInLink from "Components/Library/Auth/AuthEmailer";
import Panel from 'Components/Library/Panel/Panel';

const ClientAccountPage = () => {
    const [state] = useContext(Context);

    let { clientId } = useParams();

    let client = state.Clients.find(c => c.Id === clientId);

    let advisor = state.Advisors.find(a => a.Id === client.AdvisorId);

    return (
        <Panel>
            <p>
                Client: {client.Identity.Surname}, {client.Identity.Forenames}
            </p>
            <p>
                Email:&nbsp;
                <MuiLink
                    href   = {`mailto:${client.Identity.Email}`}
                    target = '_blank'
                    rel    = 'noreferrer'
                >
                    {client.Identity.Email}
                </MuiLink>
            </p>
            <p>
                Fee: {client.Fee}%
            </p>
            <p>
                Advisor: {advisor.Surname}, {advisor.Forenames}
            </p>

            <Toolbar className="breadcrumb-action">
                <Link to={{ pathname: `/clients/id/${client.Id}/edit` }}><Button>Edit client</Button></Link>
                
                <Button onClick={SendSignInLink.bind(null, client.Identity.Email)}>
                    Send sign-in link
                </Button>
            </Toolbar>
        </Panel>
    );
}   

export default ClientAccountPage;