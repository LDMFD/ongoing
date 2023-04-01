import React, { useContext, useCallback } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import {
    Button,
    Toolbar,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { GoBack } from 'Utils/Routing';

import { Context, Api } from 'State'
import Table from 'Components/Library/Table/Table';
import { FormatCurrencyPence } from 'Utils/Strings';

const ProviderChargeList = () => {
    let history = useHistory();
    let goBack = GoBack(history);
    const [ state, dispatch] = useContext(Context);

    let { policyProviderId } = useParams();

    const onDelete = useCallback(id => async () => {
        if (window.confirm(`Delete charge?`)) {
            await Api.OrgResources.ProviderCharges.Delete(id);
            await Api.OrgResources.Entities.Read(dispatch);
        }
    }, [ dispatch ]);

    const onEdit = useCallback(id => () => {
        history.push(`/platforms/id/${policyProviderId}/provider-charges/${id}/edit`);
    }, [ history, policyProviderId ]);

    const columns = [
        {
            accessor: 'boundary',
            Header: 'Range',
            width: 300,
        }, {
            accessor: 'charge',
            Header: 'Annual Fee',
            width: 150,
        }, {
            accessor: 'actions',
            Header: '',
            width: 100,
            Cell: ({ row }) => (
                <>
                    <button onClick={onEdit(row.original.id)} className='ong-openFileIcon'>
                        <EditIcon />
                    </button>
                    <button onClick={onDelete(row.original.id)} className='ong-openFileIcon'>
                        <DeleteIcon />
                    </button>
                </>
            ),
        },
    ];
    
    let charges = state.Resources.ProviderCharges;

    charges = charges
        .filter(pc => pc.ProviderId === policyProviderId);

    charges = charges.map((m, ix) => {
        let lower = FormatCurrencyPence(m.Boundary);
        let upper = ix < charges.length-1
            ? FormatCurrencyPence(charges[ix+1].Boundary-1)
            : '';
        return {
            id:       m.Id,
            charge:   `${m.Charge}%`,
            boundary: upper ? `${lower} - ${upper}` : `> ${lower}`,
        };
    });

    return (
        <Dialog open={true} onClose={goBack}>
            <DialogTitle>Provider charges</DialogTitle>
                <DialogContent>

                    {/* <DialogContentText> */}
                        
                    <Toolbar className="breadcrumb-action">
                        <Link to={{ pathname: `/platforms/id/${policyProviderId}/provider-charges/add` }}><Button>Add new charge</Button></Link>
                    </Toolbar>

                    <Table columns   = {columns}
                           data      = {charges} />

                </DialogContent>
                <DialogActions>
                    <Button onClick={goBack}>Return to provider</Button>
                </DialogActions>
        </Dialog>
    );
}

export default ProviderChargeList;
