import React, { useContext, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';
import {
    Button,
    Toolbar,
} from '@mui/material';

import { Context, Api } from 'State'
import { GetReport } from 'Components/ReviewComponents/GetReport';
import { Download } from 'Components/Library/FileHandling/FileDownloader';
import Table from 'Components/Library/Table/Table';

const PortfolioList = () => {
    let history = useHistory();

    const [state, dispatch ] = useContext(Context);
    let {
        ClientContext: client,
    } = state;

    let report = GetReport();

    const deletePortfolio = useCallback(id => async () => {
        if (window.confirm(`Delete portfolio?`)) {
            await Api.Advisor.Portfolios.Delete(client.Id, id);
            await Api.Advisor.ClientDetail.Read(dispatch, client.Id);
        }        
    }, [ dispatch, client.Id ]);

    const editPortfolio = useCallback(id => () => {
        history.push(`/clients/id/${client.Id}/holdings/portfolios/id/${id}/edit`);
    }, [ history, client.Id ]);

    const downloadFile = useCallback(fileUid => () => {
        Download(fileUid);
    }, []);

    const columns = [{
        accessor: 'policy',
        Header: 'Policy',
        type: 'actions',
        width: 100,
        Cell: ({ row }) => (
            <>
                {row.original.policy.ExternalId}
                {row.original.policy.File?.Uid && 
                    <button onClick={downloadFile(row.original.policy.File.Uid)} className='ong-openFileIcon'>
                        <DownloadIcon />
                    </button>
                }
            </>
        ),
    }, {
        accessor: 'model',
        Header: 'Model',
        type: 'actions',
        width: 100,
        Cell: ({ row }) => (
            <>
                {row.original.model.Name}
                {row.original.model.File?.Uid && 
                    <button onClick={downloadFile(row.original.model.File.Uid)} className='ong-openFileIcon'>
                        <DownloadIcon />
                    </button>
                }
            </>
        ),
    }, {
        accessor: 'proportion',
        Header: 'Proportion',
        width: 100,
    }, {
        accessor: 'actions',
        Header: '',
        width: 20,
        Cell: ({ row }) => (
            <>
                <button onClick={editPortfolio(row.original.id)} className='ong-openFileIcon'>
                    <EditIcon />
                </button>
                <button onClick={deletePortfolio(row.original.id)} className='ong-openFileIcon'>
                    <DeleteIcon />
                </button>
            </>
        ),
    }];

    let portfolios = report.Portfolios.map(portfolio => {
        let policy = report.Policies.find(p => p.Id === portfolio.PolicyId);
        let model = report.Models.find(p => p.Id === portfolio.ModelId);
        return {
            id:         portfolio.Id,
            idLabel:    `#${portfolio.Id}`,
            model:      model,
            policy:     policy,
            proportion: `${portfolio.Proportion * 100}%`,
        };
    });

    return (
        <div className='ongoing-portfolioList'>
            <Toolbar className="breadcrumb-action">
                <Link to={{ pathname: `/clients/id/${client.Id}/holdings/portfolios/add` }}><Button>Add portfolio</Button></Link>
            </Toolbar>

            <Table columns={columns} data={portfolios} />
        </div>
    );
}

export default PortfolioList;
