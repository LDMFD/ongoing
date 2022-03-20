// TODO rename this something like StateLoader

import React, { useEffect, useContext, useCallback, useState } from 'react';

import Api from './Api';

import { Context } from 'State/StateProvider'
import { UserType } from 'components/AuthControl';

const InitialState = ({ children }) => {
    const [ state, dispatch ] = useContext(Context);

    let [ loaded, setLoaded ] = useState(false);

    // Advisors
    const getClients            = useCallback(() => { return Api.Clients.Clients.Read(dispatch); },           [ dispatch ]);
    const getFunds              = useCallback(() => { return Api.Global.Funds.Read(dispatch); },              [ dispatch ]);
    const getOperators          = useCallback(() => { return Api.Global.Operators.Read(dispatch); },          [ dispatch ]);
    const getPolicyProviders    = useCallback(() => { return Api.Global.PolicyProviders.Read(dispatch); },    [ dispatch ]);
    const getPolicyTypes        = useCallback(() => { return Api.Global.PolicyTypes.Read(dispatch); },        [ dispatch ]);
    const getModels             = useCallback(() => { return Api.Global.Models.Read(dispatch); },             [ dispatch ]);
    const getRiskAssessments    = useCallback(() => { return Api.Global.RiskAssessments.Read(dispatch); },    [ dispatch ]);
    const getModulePresets      = useCallback(() => { return Api.Global.ModulePresets.Read(dispatch); },      [ dispatch ]);
    
    const getAdvisorDependencies = useCallback(async () => {
        await getFunds();  // TODO parallelize
        await getPolicyProviders();
        await getPolicyTypes();

        await getOperators();
        await getModels();

        await getRiskAssessments();
        await getModulePresets();

        await getClients();

        setLoaded(true);
    }, [
        getFunds,
        getPolicyProviders,
        getPolicyTypes,
        
        getOperators,
        getModels,

        getRiskAssessments,
        getModulePresets,

        getClients,
    ]);

    // Client space
    const getClientSpace = useCallback(() => { return Api.ClientSpace.ClientDetail.Read(dispatch); },    [ dispatch ]);

    const getClientSpaceDependencies = useCallback(async () => {
        await getClientSpace();
        setLoaded(true);
    }, [
        getClientSpace,
    ]);

    const getDependencies = state.Auth.UserType === UserType.UserTypeAdvisor
                         || state.Auth.UserType === UserType.UserTypeAdmin
        ? getAdvisorDependencies
        : getClientSpaceDependencies;

    useEffect(() => {
        getDependencies();
    }, [ getDependencies ]);

    return loaded ? (
        <>
            {children}
        </>
    ) : null;
}

export default InitialState;
