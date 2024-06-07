import { useHistory } from "react-router-dom";

import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';

import Dialog from 'Components/Library/Dialog/Dialog';
import { SelectControl } from 'Components/Library/FormControls/SelectControl';
import { Context } from 'State/StateProvider';
import { PlannrAccount } from 'Types/Integrations';
import { deleteCookie, getCookie } from "Utils/Cookies";
import { Api } from "State";

const PlannrAccountChooser = () => {
    let history = useHistory();

    // @ts-ignore
    const [ state, ] = useContext(Context);

    const { handleSubmit, control } = useForm<PlannrAccount>({
        defaultValues: {},
    });

    const onSubmit = async (account: PlannrAccount) => {
        let sessionId = getCookie('PlannrSessionId');
        await Api.Integrations.Plannr.CreateSession(account.uuid, sessionId);
        deleteCookie('PlannrSessionId');

        history.push(`/settings/integrations/plannr/clients`);
    };

    let accounts = state.Integrations.Plannr.Accounts.map((t: PlannrAccount) => ({
        Id: t.uuid,
        Name: t.name
    }));

    console.log('accounts',accounts)
    
    let submitRef = React.createRef();

    return (
        <Dialog
            title       = {'Plannr integration'}
            intro       = 'Choose Plannr account to connect:'
            submitLabel = {'Connect'}
            submitRef   = {submitRef}
            onSubmit    = {handleSubmit(onSubmit)}
            content = {
                <>
                    <SelectControl
                        name='uuid'
                        options={accounts}
                        label='Plannr account'
                        control={control}
                        required
                    />
                    <br />
                </>
            }
        />
    );
}

export default PlannrAccountChooser;
