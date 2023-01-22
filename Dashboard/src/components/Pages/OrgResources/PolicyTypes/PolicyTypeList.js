import React, { useContext, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Button,
    Toolbar,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconGroup from 'Components/Library/IconGroup/IconGroup';

import { Context, Api } from 'State'
import OgTable from 'Components/Library/Table/Table';

const PolicyTypeList = () => {
    const [ state, dispatch ] = useContext(Context);

    const sync = useCallback(() => {
        Api.OrgResources.Entities.Read(dispatch)
    }, [ dispatch ]);

    useEffect(() => {
        sync();
    }, [ sync ]);

    const columns = [
        { 
            accessor: 'name',
            Header: 'Name',
            width: 1,
        },
        {
            accessor: 'actions',
            width: .2,
            Cell: ({ row }) => (
                <IconGroup>
                    <Link to={`/policy-types/id/${row.original.id}/delete`}>
                        <DeleteIcon />
                    </Link>
                    <Link to={`/policy-types/id/${row.original.id}/edit`}>
                        <EditIcon />
                    </Link>
                </IconGroup>
            ),
        },
    ];

    let policyTypes = state.Resources.PolicyTypes.map(p => {
        return {
            id:       p.Id,
            name:     p.Name,
        };
    });

    return (
        <>
            <Toolbar className="breadcrumb-action">
                <Link to={{ pathname: '/policy-types/add' }}><Button>Add new policy type</Button></Link>
            </Toolbar>

            <OgTable columns={columns} data={policyTypes} />
        </>
    );
}

export default PolicyTypeList;
