import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import {
    Button,
    Toolbar,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconGroup from 'Components/Library/IconGroup/IconGroup';

import { Context } from 'State'
import OgTable from 'Components/Library/Table/Table';

const PolicyGroupList = () => {
    const [ state, ] = useContext(Context);

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
                    <Link to={`/policy-groups/id/${row.original.id}/delete`}>
                        <DeleteIcon />
                    </Link>
                    <Link to={`/policy-groups/id/${row.original.id}/edit`}>
                        <EditIcon />
                    </Link>
                </IconGroup>
            ),
        },
    ];

    let policyGroups = state.Resources.PolicyGroups.map(p => {
        return {
            id:       p.Id,
            name:     p.Name,
        };
    });

    return (
        <>
            <Toolbar className="breadcrumb-action">
                <Link to={{ pathname: '/policy-groups/add' }}><Button>Add new policy group</Button></Link>
            </Toolbar>

            <OgTable columns={columns} data={policyGroups} />
        </>
    );
}

export default PolicyGroupList;
