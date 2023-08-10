import { useContext, useState } from 'react';
import { useHistory } from "react-router-dom";

import { Api } from 'State';
import { Context } from 'State/StateProvider';
import { DefaultRiskProvider } from './DefaultRiskProvider';
import { GoBack } from 'Utils/Routing';
import RiskProviderDialog from './RiskProviderDialog';

const AddRiskProvider = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch] = useContext(Context);

    const [ error, setError ] = useState(null);

    const submitHandler = async (riskProvider) => {
        let response = await Api.OrgResources.RiskProviders.Create(riskProvider);
        if (response.error) {
            setError(response.error);
        } else {
            await Api.OrgResources.Entities.Read(dispatch);
            goBack();
        }
    };

    return (
        <RiskProviderDialog
            state           = {state}
            riskProvider    = {DefaultRiskProvider}
            submitLabel     = 'Add'
            submitHandler   = {submitHandler}
            error           = {error}
        />
    );
}

export default AddRiskProvider;
