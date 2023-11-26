import { GetReport } from 'Components/ReviewComponents/GetReport';
import { DownloadChip } from 'Components/Library/FileHandling/FileDownloader';
import { ModuleTypeFactFind } from 'State/ApiCommands/OrgResources/Reviews/ModuleTypes';
import Module from 'Components/Pages/Advisor/Reviews/Modules/Module';
import TabContent from 'Components/Library/TabContent/TabContent';
import { FromCanonical } from 'Utils/DateTime';

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
        <TabContent>
            <Module module={ModuleTypeFactFind} />
 
            {factFind &&
                <p>
                    <DownloadChip
                        title={`Fact find ${FromCanonical(factFind.submitted)}`}
                        fileId={factFind.file.Uid}
                    />
                </p>
            }
        </TabContent>
    );
}

export default FactFind;
