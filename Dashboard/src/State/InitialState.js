// TODO rename this something like StateLoader

import React, { useEffect, useContext, useCallback, useState } from 'react';

import Api from './Api';

import { Context } from 'State/StateProvider'
import { UserType } from 'Components/AuthControl';

const InitialState = ({ children }) => {
    const [ state, dispatch ] = useContext(Context);

    let [ loaded, setLoaded ] = useState(false);

    // Advisors
    const getClients        = useCallback(() => { return Api.Advisor.Clients.Read(dispatch); }, [ dispatch ]);
    const getGlobalEntities = useCallback(() => { return Api.Global.Entities.Read(dispatch); }, [ dispatch ]);
    
    const getAdvisorDependencies = useCallback(async () => {
        await getGlobalEntities();
        await getClients();

        setLoaded(true);
    }, [
        getGlobalEntities,
        getClients,
    ]);

    // Client space
    const getClientSpace = useCallback(() => { return Api.ClientSpace.ClientDetail.Read(dispatch); }, [ dispatch ]);

    const getClientSpaceDependencies = useCallback(async () => {
        await getClientSpace();
        setLoaded(true);
    }, [
        getClientSpace,
    ]);

    // Admin
    const getOrgs = useCallback(() => { return Api.Superuser.Organisations.Read(dispatch); }, [ dispatch ]);

    const getSuperuserDependencies = useCallback(async () => {
        await getOrgs();
        setLoaded(true);
    }, [
        getOrgs,
    ]);

    let dependencyFetcher = {
        [UserType.Superuser]: getSuperuserDependencies,
        [UserType.OrgOwner]: getAdvisorDependencies,
        [UserType.OrgAdmin]: getAdvisorDependencies,
        [UserType.Advisor]: getAdvisorDependencies,
        [UserType.Client]: getClientSpaceDependencies,
    };

    const getDependencies = dependencyFetcher[state.Session.Role];

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
