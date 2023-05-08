import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import {
    Link as MuiLink
} from '@mui/material';
// import EmailIcon from '@mui/icons-material/Email';

import { Context } from 'State';
import SendSignInLink from "Components/Library/Auth/AuthEmailer";
import Panel from 'Components/Library/Panel/Panel';
import Dropdown from 'Components/Library/Dropdown/Dropdown';

const ClientAccountPage = () => {
    const [state] = useContext(Context);

    let { clientId } = useParams();

    let client = state.Clients.find(c => c.Id === clientId);

    let advisor = state.Advisors.find(a => a.Id === client.AdvisorId);

    return (
        <Panel>
            <div style={{ float: 'right', margin: '1rem' }}>
                <Dropdown
                    title = 'Client actions'
                    items = {[
                        {
                            label: 'Send sign-in link',
                            onClick: () => SendSignInLink(client.Identity.Email),
                        },
                        {
                            label: 'Edit client details',
                            link: `/clients/id/${client.Id}/edit`,
                        },
                        {
                            label: 'Delete client',
                            link: `/clients/id/${client.Id}/delete`,
                        },
                    ]}
                />
            </div>

            <p>
                Email:&nbsp;
                <MuiLink
                    href   = {`mailto:${client.Identity.Email}`}
                    target = '_blank'
                    rel    = 'noreferrer'
                >
                    {client.Identity.Forenames} {client.Identity.Surname} &lt;{client.Identity.Email}&gt;
                </MuiLink>
            </p>
            <p>
                Fee: {client.Fee}%
            </p>
            <p>
                Advisor: {advisor.Forenames} {advisor.Surname}
            </p>
        </Panel>
    );
}   

export default ClientAccountPage;