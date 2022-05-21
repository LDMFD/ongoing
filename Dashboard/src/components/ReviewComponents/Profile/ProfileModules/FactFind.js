import React, { useCallback } from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import Day from 'dayjs';

import { GetReport } from 'Components/ReviewComponents/GetReport';
import { Download } from 'Components/Library/FileHandling/FileDownloader';
import { ModuleTypeFactFind } from 'State/ApiCommands/Global/Reviews/ModuleTypes';
import Module from 'Components/Pages/Advisor/Reviews/Modules/Module';

const FactFind = () => {
    let report = GetReport();

    const downloadFile = useCallback(fileUid => () => {
        Download(fileUid);
    }, []);

    let factFind = report.FactFinds.map(ff => {
        return {
            id:        ff.Id,
            submitted: Day(ff.Submitted).format('DD-MM-YYYY'),
            file:      ff.File,
        };
    }).sort((p,q) => (p.submitted > q.submitted) ? -1 : ((p.submitted < q.submitted) ? 1 : 0))[0];

    return (
        <>
            <Module module={ModuleTypeFactFind} />
 
            {factFind &&
                <p>
                    Submitted: {Day(factFind.Submitted).format('DD-MM-YYYY')}

                    <br />
                    <button onClick={downloadFile(factFind.file.Uid)} className='ong-openFileIcon'>
                        {factFind.file.Filename}
                        <DownloadIcon />
                    </button>
                </p>
            }
        </>
    );
}

export default FactFind;
