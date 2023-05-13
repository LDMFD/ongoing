import Day from 'dayjs';
import { useContext } from 'react';

import { BuildDownloadChip } from 'Components/Library/FileHandling/FileDownloader';
import Table from 'Components/Library/Table/Table';
import { GetReport } from 'Components/ReviewComponents/GetReport';
import { Context } from 'State/StateProvider';

const FeesReportList = () => {
    const [ state ] = useContext(Context);

    let report = GetReport();

    const columns = [{
        id: 'submitted',
        header: 'Submitted',
    }];

    let feesReports = report.FeesReports.map(ff => {
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
            data                  = {feesReports}
            resource              = {`clients/id/${state.Metadata.Id}/documents/fees-reports`}
            label                 = 'Fee Report'
            defaultActionHeader   = 'Download'
            defaultActionRenderer = {BuildDownloadChip('Fee Report')}
        />
    );
}

export default FeesReportList;
