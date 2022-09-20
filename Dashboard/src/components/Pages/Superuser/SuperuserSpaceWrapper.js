// TODO rename AdvisorSpaceClientTabs

import React, { useEffect, useContext, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Breadcrumbs,
} from '@mui/material';

import { Context } from 'State/StateProvider'
import { Api } from 'State';

const AdminSpaceWrapper = ({ children }) => {
    const [ , dispatch ] = useContext(Context);

    let [ loaded, setLoaded ] = useState(false);

    const getDependencies = useCallback(async () => {
        await Api.Superuser.Organisations.Read(dispatch);
        setLoaded(true);
    }, [ dispatch ]);

    useEffect(() => {
        getDependencies();
    }, [ getDependencies ]);

    return loaded ? (
        <div>
            <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" color="inherit" to='/admin/organisations'>
                    Organisations
                </Link>
            </Breadcrumbs>

            {children}
        </div>
    ) : null;
}

export default AdminSpaceWrapper;
