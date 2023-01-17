import React, { useCallback } from 'react';
import {
    Button,
} from '@mui/material';

import Day from 'dayjs';

export const Export = () => {
    const _export = useCallback(() => {
        let date = Day(new Date()).format();
        let filename = `Amplifa-export-${date}.json`;

        window.ApiClient({
            url: 'admin/export',
            method: 'GET',
            responseType: 'blob',
            headers: {
                'Cache-Control': 'no-cache,max-age=0',
                'Content-Disposition': `attachment; filename=${filename}`,
            },
        }).then((response) => {
            // https://stackoverflow.com/a/53230807
            const href = URL.createObjectURL(response.data);
            const link = document.createElement('a');
            link.href = href;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            URL.revokeObjectURL(href);
        });
    ;
    }, []);

    return (
        <>
            <Button onClick={_export}>
                Download full database export (JSON)
            </Button>
        </>
    );
};

export default Export;
