import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Tab,
    Tabs,
} from '@mui/material';

import { RouteMatch } from 'Utils/Routing';
import Module from 'Components/Pages/Advisor/Reviews/Modules/Module';
import { ModuleTypeProfile } from 'State/ApiCommands/Global/Reviews/ModuleTypes';
import { Context } from 'State';

const ProfileTabs = ({ basePath, baseTarget, children }) => {
    const [state,  ] = useContext(Context);
    let client = state.ClientContext;

    const { pathname } = useLocation();

    let routeMatch = RouteMatch(pathname, [
        `${basePath}/fact-find`,
        `${basePath}/risk-questionnaire`,
        `${basePath}/goals`,
    ]);
    let currentTab = routeMatch?.path;

    return (
        <>
            <Module client = {client}
                    module = {ModuleTypeProfile} />
            <br />

            <Tabs value={currentTab}>
                <Tab label="Fact find"          value={`${basePath}/fact-find`}          to={`${baseTarget}/fact-find`}          component={Link} />
                <Tab label="Risk Questionnaire" value={`${basePath}/risk-questionnaire`} to={`${baseTarget}/risk-questionnaire`} component={Link} />
                <Tab label="Goals"              value={`${basePath}/goals`}              to={`${baseTarget}/goals`}              component={Link} />
            </Tabs>

            {children}
        </>
    );
};

export default ProfileTabs;