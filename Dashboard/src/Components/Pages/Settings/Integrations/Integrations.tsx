import {
    Button,
} from '@mui/material';

import PageTitle from 'Components/Library/PageTitle/PageTitle';
import Panel from 'Components/Library/Panel/Panel';
import { Api } from 'State';
import { setCookie } from 'Utils/Cookies';

const Integrations = () => {
    let connectPlannr = async () => {
        let res = await Api.Integrations.Plannr.GetAuthorizationUrl();

        setCookie('PlannrSessionId', res.data.State);

        window.location = res.data.Url;
    };

    return (
        <Panel>
            <PageTitle title='Integrations | Amplifa' />
            
            Connect to your Plannr account to bring your clients into Amplifa.

            <Button onClick={connectPlannr}>
                Connect
            </Button>
        </Panel>
    );
}

export default Integrations;
