import React, { Fragment } from 'react'
import { useTable, useFlexLayout, useExpanded } from 'react-table'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow 
} from '@mui/material';

import './Table.css';

function OgTable({ columns, data, renderRowSubComponent }) {
    columns = React.useMemo(() => columns, [columns]);
    data = React.useMemo(() => data, [data]);

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
        useFlexLayout,
        useExpanded
    );

    return (
        <div className="tableWrap">
            <Table {...getTableProps()}>
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
        </div>
    )
}

export default OgTable;
