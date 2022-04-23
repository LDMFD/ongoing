import React, { useContext, useCallback } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
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

const ProviderChargeList = () => {
    let history = useHistory();
    let goBack = GoBack(history);
    const [ state, dispatch] = useContext(Context);

    let { policyProviderId } = useParams();

    const onDelete = useCallback(params => async () => {
        if (window.confirm(`Delete charge?`)) {
            await Api.Global.ProviderCharges.Delete(params.row.id);
            await Api.Global.Entities.Read(dispatch);
        }
    }, [ dispatch ]);

    const onEdit = useCallback(params => () => {
        history.push(`/policy-providers/id/${policyProviderId}/provider-charges/${params.row.id}/edit`);
    }, [ history, policyProviderId ]);

    const columns = [
        { field: 'desc',   headerName: 'Desc',   flex: 0.2, },
        { field: 'charge', headerName: 'Charge', flex: 0.2, },
        {
            field: 'actions',
            type: 'actions',
            flex: .1,
            getActions: (params) => [
                <GridActionsCellItem icon={<EditIcon />}   onClick={onEdit(params)}   label="Edit" />,
                <GridActionsCellItem icon={<DeleteIcon />} onClick={onDelete(params)} label="Delete" />,
            ]
        },
    ];
    
    let providerCharges = state.Entities.ProviderCharges
        .filter(pc => pc.ProviderId === policyProviderId)
        .map(m => ({
                id:                m.Id,
                desc:              m.Desc,
                charge:            m.Charge,
            })
        );

    let data = {
        rows: providerCharges,
        columns: columns,
    }

    return (
        <Dialog open={true} onClose={goBack}>
            <DialogTitle>Provider charges</DialogTitle>
                <DialogContent>

                    {/* <DialogContentText> */}
                        
                    <Toolbar className="breadcrumb-action">
                        <Link to={{ pathname: `/policy-providers/id/${policyProviderId}/provider-charges/add` }}><Button>Add new charge</Button></Link>
                    </Toolbar>

                    <DataGrid autoHeight {...data} />

                </DialogContent>
                <DialogActions>
                    <Button onClick={goBack}>Return to provider</Button>
                </DialogActions>
        </Dialog>
    );
}

export default ProviderChargeList;
