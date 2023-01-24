import React, { useContext, useCallback, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
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
import IconGroup from 'Components/Library/IconGroup/IconGroup';
import { ProportionWarning } from 'Components/Library/Warning/ProportionWarning';

const PortfolioList = () => {
    const [state, dispatch ] = useContext(Context);
    let {
        Metadata: client,
    } = state;

    let { clientId } = useParams();

    const sync = useCallback(() => {
        Api.Advisor.ClientDetail.Read(dispatch, clientId);
    }, [ dispatch, clientId ]);

    useEffect(() => {
        sync();
    }, [ sync ]);

    let report = GetReport();

    const downloadFile = useCallback(fileUid => () => {
        Download(fileUid);
    }, []);

    const columns = [{
        accessor: 'policy',
        Header: 'Policy',
        type: 'actions',
        width: 15,
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
        accessor: 'operator',
        Header: 'Operator',
        type: 'actions',
        width: 15,
    }, {
        accessor: 'model',
        Header: 'Model',
        type: 'actions',
        width: 15,
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
        Header: '% of policy',
        width: 10,
    }, {
        accessor: 'includeInFee',
        Header: 'Include in fee?',
        width: 5,
    }, {
        accessor: 'actions',
        Header: '',
        width: 10,
        Cell: ({ row }) => (
            <IconGroup>
                <Link to={`/clients/id/${client.Id}/holdings/portfolios/id/${row.original.id}/delete`}>
                    <DeleteIcon />
                </Link>
                <Link to={`/clients/id/${client.Id}/holdings/portfolios/id/${row.original.id}/edit`}>
                    <EditIcon />
                </Link>
            </IconGroup>
        ),
    }];

    let portfolios = report.Portfolios.map(portfolio => {
        let policy = report.Policies.find(p => p.Id === portfolio.PolicyId);
        let model = report.Models.find(p => p.Id === portfolio.ModelId);
        let operator = report.Operators.find(o => o.Id === model.OperatorId);
        return {
            id:           portfolio.Id,
            idLabel:      `#${portfolio.Id}`,
            model:        model,
            operator:     operator.Name,
            policy:       policy,
            proportion:   `${portfolio.Proportion * 100}%`,
            includeInFee: portfolio.IncludeInFee ? 'Y' : 'N',
        };
    }).reverse();

    return (
        <div className='ongoing-portfolioList'>
            <Toolbar className="breadcrumb-action">
                <Link to={{ pathname: `/clients/id/${client.Id}/holdings/portfolios/add` }}><Button>Add portfolio</Button></Link>
            </Toolbar>

            <Table columns={columns} data={portfolios} />

            <ProportionWarning data={report.Portfolios} property='Proportion' />
        </div>
    );
}

export default PortfolioList;
