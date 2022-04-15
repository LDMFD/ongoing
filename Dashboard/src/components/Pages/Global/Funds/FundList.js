import React, { useEffect, useContext, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import {
    Button,
    Toolbar,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';

import { Context, Api } from 'State'
import { Download } from 'Components/Widgets/FileHandling/FileDownloader';

const FundList = () => {
    let history = useHistory();
    const [ state, dispatch] = useContext(Context);

    const getFunds = useCallback(() => {
        Api.Global.Entities.Read(dispatch)
    }, [ dispatch ]);

    useEffect(() => {
        getFunds();
    }, [ getFunds ]);
    
    const onDelete = useCallback(params => async () => {
        if (window.confirm(`Delete fund?`)) {
            await window.ApiClient.delete(`advisor/funds/${params.row.id}`)
            await Api.Global.Entities.Read(dispatch);
        }        
    }, [ dispatch ]);

    const onEdit = useCallback(params => () => {
        let id = params.row.id;
        history.push(`/funds/id/${id}/edit`);
    }, [ history ]);

    const downloadFile = useCallback(params => () => {
        Download(params.row.fileUid);
    }, []);

    const columns = [
        { field: 'name',      headerName: 'Name',        flex: 0.3, },
        { field: 'ocfFee',    headerName: 'OCF Fee',     flex: 0.1, },
        { field: 'exAnteFee', headerName: 'Ex Ante Fee', flex: 0.1, },
        // TODO SEDOL, ISIN, Citicode
        {
            field: 'actions',
            type: 'actions',
            flex: .05,
            getActions: (params) => ([
                params.row.fileUid
                    ? <GridActionsCellItem icon={<DownloadIcon />} onClick={downloadFile(params)} label="Download factsheet" />
                    : null,
                <GridActionsCellItem icon={<EditIcon />}     onClick={onEdit(params)}   label="Edit" />,
                <GridActionsCellItem icon={<DeleteIcon />}   onClick={onDelete(params)} label="Delete" />,
            ].filter(t => t)),
        },
    ];

    let funds = state.Entities.Funds.map(f => {
        return {
            id:        f.Id,
            name:      f.Name,
            ocfFee:    f.OcfFee,
            exAnteFee: f.ExAnteFee,
            fileUid:   f.File?.Uid,
        };
    });

    let data = {
        rows: funds,
        columns: columns,
    }

    return (
        <>
            <Toolbar className="breadcrumb-action">
                <Link to={{ pathname: '/funds/add' }}><Button>Add new fund</Button></Link>
            </Toolbar>

            <DataGrid autoHeight {...data} />
        </>
    );
}

export default FundList;
