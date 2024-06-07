import React, {  } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Tab,
    Tabs,
} from '@mui/material';

import { RouteMatch } from 'Utils/Routing';

const SettingsTabs = ({ children }) => {
    const { pathname } = useLocation();

    function SettingsTabsComponent() {
        let basePath = '/settings';
        let baseTarget = `/settings`;

        let routeMatch = RouteMatch(pathname, [
            `${basePath}/integrations`,
            `${basePath}/export`,
        ]);
        let currentTab = routeMatch?.path;
        
        return (
            <Tabs value={currentTab}>
                <Tab
                    label     = "Integrations"
                    value     = {`${basePath}/integrations`}
                    to        = {`${baseTarget}/integrations`}
                    component = {Link}
                />
                <Tab
                    label     = "Export"
                    value     = {`${basePath}/export`}
                    to        = {`${baseTarget}/export`}
                    component = {Link}
                />
            </Tabs>
        );
    }

    return (
        <div>
            <SettingsTabsComponent />
            <br />
            {children}
        </div>
    );
}

export default SettingsTabs;
