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
import IconGroup from 'Components/Library/IconGroup/IconGroup';
import Table from 'Components/Library/Table/Table';
import { ProportionWarning } from 'Components/Library/Warning/ProportionWarning';

const PolicyFundList = () => {
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
        width: 30,
    }, {
        accessor: 'fund',
        Header: 'Fund',
        width: 30,
        Cell: ({ row }) => (
            <>
                {row.original.fund}
                {row.original.fileUid && 
                    <button onClick={downloadFile(row.original.fileUid)} className='ong-openFileIcon'>
                        <DownloadIcon />
                    </button>
                }
            </>
        ),
    }, {
        accessor: 'proportion',
        Header: 'Proportion',
        width: 10,
    }, {
        accessor: 'includeInFee',
        Header: 'Include in fee?',
        width: 10,
    }, {
        accessor: 'actions',
        width: 10,
        Cell: ({ row }) => (
            <IconGroup>
                <Link to={`/clients/id/${client.Id}/holdings/policy-funds/id/${row.original.id}/delete`}>
                    <DeleteIcon />
                </Link>
                <Link to={`/clients/id/${client.Id}/holdings/policy-funds/id/${row.original.id}/edit`}>
                    <EditIcon />
                </Link>
            </IconGroup>
        ),
    }];

    let policyFunds = report.PolicyFunds.map(policyFund => {
        let policy = report.Policies.find(p => p.Id === policyFund.PolicyId).ExternalId;
        let fund = report.Funds.find(p => p.Id === policyFund.FundId);
        return {
            id:           policyFund.Id,
            idLabel:      `#${policyFund.Id}`,
            policy,
            fund:         fund.Name,
            proportion:   `${policyFund.Proportion * 100}%`,
            includeInFee: policyFund.IncludeInFee ? 'Y' : 'N',
            fileUid:      fund.File?.Uid,
        };
    });

    return (
        <>
            <Toolbar className="breadcrumb-action">
                <Link to={{ pathname: `/clients/id/${client.Id}/holdings/policy-funds/add` }}><Button>Add policy fund</Button></Link>
            </Toolbar>

            <Table columns={columns} data={policyFunds} />

            <ProportionWarning data={report.PolicyFunds} property='Proportion' />
        </>
    );
}

export default PolicyFundList;
