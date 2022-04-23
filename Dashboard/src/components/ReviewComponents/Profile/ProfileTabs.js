import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Tab,
    Tabs,
} from '@mui/material';

import { RouteMatch } from 'Utils/Routing';
import ModuleWrapper from 'Components/Pages/Advisor/Reviews/Modules/ModuleWrapper';
import { ModuleTypeProfile } from 'State/ApiCommands/Global/Reviews/ModuleTypes';
import { Context } from 'State';

const ProfileTabs = ({ basePath, baseTarget, children }) => {
    const [state,  ] = useContext(Context);
    let client = state.ClientContext;

    const { pathname } = useLocation();

    let routeMatch = RouteMatch(pathname, [
        `${basePath}/fact-find`,
        `${basePath}/risk-questionnaire`,
        `${basePath}/objectives`,
    ]);
    let currentTab = routeMatch?.path;

    return (
        <>
            <ModuleWrapper client = {client}
                           module = {ModuleTypeProfile} />
            <br />

            <Tabs value={currentTab}>
                <Tab label="Fact find"          value={`${basePath}/fact-find`}          to={`${baseTarget}/fact-find`}          component={Link} />
                <Tab label="Risk Questionnaire" value={`${basePath}/risk-questionnaire`} to={`${baseTarget}/risk-questionnaire`} component={Link} />
                <Tab label="Objectives"         value={`${basePath}/objectives`}         to={`${baseTarget}/objectives`}         component={Link} />
            </Tabs>

            {children}
        </>
    );
};

export default ProfileTabs;