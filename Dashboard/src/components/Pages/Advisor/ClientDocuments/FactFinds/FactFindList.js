import { useContext } from 'react';
import Day from 'dayjs';

import { GetReport } from 'Components/ReviewComponents/GetReport';
import { Context } from 'State/StateProvider';
import Table from 'Components/Library/Table/Table';
import { BuildDownloadChip } from 'Components/Library/FileHandling/FileDownloader';

const FactFindList = () => {
    const [ state ] = useContext(Context);

    let report = GetReport();

    const columns = [{
        id: 'submitted',
        header: 'Submitted',
    }];

    let factFinds = report.FactFinds.map(ff => {
        return {
            id:        ff.Id,
            submitted: Day(ff.Submitted).utc(false).format('DD-MM-YYYY'),
            fileId:    ff.File.Uid,
        };
    }).sort((p,q) => (p.submitted < q.submitted) ? -1 : ((p.submitted > q.submitted) ? 1 : 0));

    return (
        <Table
            flexibleColumn        = {2}
            columns               = {columns}
            data                  = {factFinds}
            resource              = {`clients/id/${state.Metadata.Id}/documents/fact-finds`}
            label                 = 'Fact Find'
            defaultActionHeader   = 'Download'
            defaultActionRenderer = {BuildDownloadChip('Fact Find')}
        />
    );
}

export default FactFindList;
