import React, { Fragment, useEffect, useRef } from 'react'
import { useTable, useExpanded } from 'react-table'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableContainer,
} from '@mui/material';

import './Table.css';

function OgTable({ columns, data, renderRowSubComponent, stickyHeader = false }) {
    columns = React.useMemo(() => columns, [columns]);
    data = React.useMemo(() => data, [data]);
    
    let [ height, setHeight ] = React.useState(0);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        visibleColumns,
        // state: { expanded },
    } = useTable(
        {
            columns,
            data
        },
        // useFlexLayout,
        useExpanded
    );

    const ref = useRef(null)

    useEffect(() => {
        if (!height) {
            setHeight(window.innerHeight - ref.current.getBoundingClientRect().top - 24)
        }
    }, [ height ])
    
    let sx = {};
    if (stickyHeader && height) {
        sx.maxHeight = height;
        sx.width = '100%';
    }

    return (
        <TableContainer sx={sx} ref={ref}>
            <Table stickyHeader {...getTableProps()}>
                <TableHead>
                    {headerGroups.map(headerGroup => (
                        <TableRow {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <TableCell {...column.getHeaderProps()}>
                                    {column.render('Header')}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableHead>
                <TableBody {...getTableBodyProps()}>
                    {rows.map((row, i) => {
                        prepareRow(row)
                        return (
                            <Fragment key={row.getRowProps().key}>
                                <TableRow {...row.getRowProps()}>
                                    {row.cells.map(cell => (
                                        <TableCell {...cell.getCellProps()}>
                                            {cell.render('Cell')}
                                        </TableCell>
                                    ))}
                                </TableRow>
                                {row.isExpanded &&
                                    <TableRow>
                                        <TableCell colSpan={visibleColumns.length}>
                                            {renderRowSubComponent(row)}
                                        </TableCell>
                                    </TableRow>
                                }
                            </Fragment>
                        )
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default OgTable;
