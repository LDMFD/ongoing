import Day from 'dayjs';

import { GetReport } from 'Components/ReviewComponents/GetReport';
import { DownloadChip } from 'Components/Library/FileHandling/FileDownloader';
import { ModuleTypeFactFind } from 'State/ApiCommands/OrgResources/Reviews/ModuleTypes';
import Module from 'Components/Pages/Advisor/Reviews/Modules/Module';

const FactFind = () => {
    let report = GetReport();

    let factFind = report.FactFinds.map(ff => {
        return {
            id:        ff.Id,
            submitted: ff.Submitted,
            file:      ff.File,
        };
    }).sort((p,q) => (p.submitted > q.submitted) ? -1 : ((p.submitted < q.submitted) ? 1 : 0))[0];

    return (
        <>
            <Module module={ModuleTypeFactFind} />
 
            {factFind &&
                <p>
                    <DownloadChip
                        title={`Fact find ${Day(factFind.submitted).utc(false).format('DD-MM-YYYY')}`}
                        fileId={factFind.file.Uid}
                    />
                </p>
            }
        </>
    );
}

export default FactFind;
