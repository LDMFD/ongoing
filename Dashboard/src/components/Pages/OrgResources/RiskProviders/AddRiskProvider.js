import { useContext, useState } from 'react';
import { useHistory } from "react-router-dom";

import { Api } from 'State';
import { Context } from 'State/StateProvider';
import { DefaultRiskProvider } from './DefaultRiskProvider';
import RiskProviderDialog from './RiskProviderDialog';

const AddRiskProvider = () => {
    let history = useHistory();

    const [ , dispatch] = useContext(Context);
    let [ riskProvider, setRiskProvider ] = useState(DefaultRiskProvider);

    const submitHandler = async (e) => {
        e.preventDefault();
        let response = await Api.OrgResources.RiskProviders.Create(riskProvider);
        await Api.OrgResources.Entities.Read(dispatch);
        history.push(`id/${response.data.Id}/risk-levels`);
        return false;
    };

    return (
        <RiskProviderDialog riskProvider    = {riskProvider}
                            setRiskProvider = {setRiskProvider}
                            submitLabel     = 'Add'
                            submitHandler   = {submitHandler} />
    );
}

export default AddRiskProvider;
