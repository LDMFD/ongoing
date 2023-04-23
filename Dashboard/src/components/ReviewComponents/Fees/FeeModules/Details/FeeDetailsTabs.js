import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Tab,
    Tabs,
} from '@mui/material';
import { RouteMatch } from 'Utils/Routing';

import { GetReport } from '../../../GetReport';

const FeeDetailsTabs = ({ children, basePath, baseTarget }) => {
    const { pathname } = useLocation();

    let routeMatch = RouteMatch(pathname, [
        `${basePath}/advice`,
        `${basePath}/platform`,
        `${basePath}/fund-level`,
        `${basePath}/portfolio-level`,
        `${basePath}/dim`,
    ]);
    let currentTab = routeMatch?.path;

    let report = GetReport();
    let includePortfolioLevel = report.Portfolios.length > 0;
    let includeFundLevel = report.Policies.some(p => report.PolicyFunds.filter(pf => pf.PolicyId === p.Id).length > 0);

    return (
        <>
            <Tabs value={currentTab}>
                <Tab label="Advice"              value={`${basePath}/advice`}          to={`${baseTarget}/advice`}          component={Link} />
                <Tab label="Platform"            value={`${basePath}/platform`}        to={`${baseTarget}/platform`}        component={Link} />
                {includeFundLevel &&
                    <Tab label="Fund-Level"      value={`${basePath}/fund-level`}      to={`${baseTarget}/fund-level`}      component={Link} />
                }
                <Tab label="DIM"                 value={`${basePath}/dim`}             to={`${baseTarget}/dim`}             component={Link} />
                {includePortfolioLevel &&
                    <Tab label="Portfolio-Level" value={`${basePath}/portfolio-level`} to={`${baseTarget}/portfolio-level`} component={Link} />
                }
            </Tabs>

            {children}
        </>
    );
};

export default FeeDetailsTabs;