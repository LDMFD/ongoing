import { useCallback, useContext, useEffect } from 'react';

import { DownloadChip } from 'Components/Library/FileHandling/FileDownloader';
import Table from 'Components/Library/Table/Table';
import { Api, Context } from 'State';
import { FromCanonical } from 'Utils/DateTime';

const ModelList = () => {
    const [ state, dispatch ] = useContext(Context);

    const sync = useCallback(() => {
        Api.OrgResources.Entities.Read(dispatch)
    }, [ dispatch ]);

    useEffect(() => {
        sync();
    }, [ sync ]);

    const columns = [
        {
            id: 'name',
            header: 'Name',
            Cell: ({ row }) => (
                <DownloadChip
                    title  = {row.original.name}
                    fileId = {row.original.fileId}
                />
            ),
        }, {
            id: 'operator',
            header: 'Operator',
            width: 150,
        }, {
            id: 'weightedOcfFee',
            header: 'Weighted OCF Fee',
            width: 150,
        }, {
            id: 'weightedExAnteFee',
            header: 'Weighted Transactional Fee',
            width: 150,
        }, {
            id: 'modified',
            header: 'Last updated',
            width: 150,
        },
    ];

    let models = state.Resources.Models.map(m => {
        let op = state.Resources.Operators.find(o => o.Id === m.OperatorId).Name;
        return {
            id:                m.Id,
            name:              m.Name,
            operator:          op,
            weightedOcfFee:    `${m.WeightedOcfFee}%`,
            weightedExAnteFee: `${m.WeightedExAnteFee}%`,
            modified:          FromCanonical(m.Modified)?.toLocaleDateString('en-GB'),
            filename:          m.File?.Filename,
            fileId:            m.File?.Uid,
        };
    });

    return (
        <Table
            flexibleColumn = {1}
            columns        = {columns}
            data           = {models}
            resource       = 'models'
            label          = 'Model'
        />
    );
}

export default ModelList;
