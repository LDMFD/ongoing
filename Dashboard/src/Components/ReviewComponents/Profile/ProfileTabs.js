import {
    Tab,
    Tabs,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

import { RouteMatch } from 'Utils/Routing';

const ProfileTabs = ({ basePath, baseTarget, children }) => {
    const { pathname } = useLocation();

    let routeMatch = RouteMatch(pathname, [
        `${basePath}/fact-find`,
        `${basePath}/risk-questionnaire`,
        `${basePath}/goals`,
    ]);
    let currentTab = routeMatch?.path;

    return (
        <>
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