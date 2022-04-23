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

const RiskLevelList = () => {
    let history = useHistory();
    let goBack = GoBack(history);
    const [ state, dispatch] = useContext(Context);

    let { riskProviderId } = useParams();

    const onDelete = useCallback(params => async () => {
        if (window.confirm(`Delete risk level?`)) {
            await Api.Global.RiskLevels.Delete(params.row.id);
            await Api.Global.Entities.Read(dispatch);
        }
    }, [ dispatch ]);

    const onEdit = useCallback(params => () => {
        history.push(`/risk-providers/id/${riskProviderId}/risk-levels/${params.row.id}/edit`);
    }, [ history, riskProviderId ]);

    const columns = [
        { field: 'level',  headerName: 'Level',  flex: 0.2, },
        { field: 'label',  headerName: 'Label',  flex: 0.2, },
        { field: 'desc',   headerName: 'Desc',   flex: 0.2, },
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
    
    let riskLevels = state.Entities.RiskLevels
        .filter(rl => rl.RiskProviderId === riskProviderId)
        .map(m => ({
                id:     m.Id,
                level:  m.Level,
                label:  m.Label,
                desc:   m.Desc,
            })
        );

    let data = {
        rows: riskLevels,
        columns: columns,
    }

    return (
        <Dialog open={true} onClose={goBack}>
            <DialogTitle>Provider risk levels</DialogTitle>
                <DialogContent>

                    <Toolbar className="breadcrumb-action">
                        <Link to={{ pathname: `/risk-providers/id/${riskProviderId}/risk-levels/add` }}><Button>Add new level</Button></Link>
                    </Toolbar>

                    <DataGrid autoHeight {...data} />

                </DialogContent>
                <DialogActions>
                    <Button onClick={goBack}>Return to provider</Button>
                </DialogActions>
        </Dialog>
    );
}

export default RiskLevelList;
