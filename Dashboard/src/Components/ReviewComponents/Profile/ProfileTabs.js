import {
    Tab,
    Tabs,
} from '@mui/material';
import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';

import TabContent from 'Components/Library/TabContent/TabContent';
import Module from 'Components/Pages/Advisor/Reviews/Modules/Module';
import { Context } from 'State';
import { ModuleTypeProfile } from 'State/ApiCommands/OrgResources/Reviews/ModuleTypes';
import { RouteMatch } from 'Utils/Routing';

const ProfileTabs = ({ basePath, baseTarget, children }) => {
    const [state,  ] = useContext(Context);
    let client = state.Metadata;

    const { pathname } = useLocation();

    let routeMatch = RouteMatch(pathname, [
        `${basePath}/fact-find`,
        `${basePath}/risk-questionnaire`,
        `${basePath}/goals`,
    ]);
    let currentTab = routeMatch?.path;

    return (
        <TabContent>
            <Module client = {client}
                    module = {ModuleTypeProfile} />

            <Tabs value={currentTab}>
                <Tab label="Fact find"          value={`${basePath}/fact-find`}          to={`${baseTarget}/fact-find`}          component={Link} />
                <Tab label="Risk Questionnaire" value={`${basePath}/risk-questionnaire`} to={`${baseTarget}/risk-questionnaire`} component={Link} />
                <Tab label="Goals"              value={`${basePath}/goals`}              to={`${baseTarget}/goals`}              component={Link} />
            </Tabs>

            {children}
        </TabContent>
    );
};

export default ProfileTabs;