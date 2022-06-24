import React from 'react'
import { useTable, useFlexLayout } from 'react-table'
import { Container, Draggable } from "react-smooth-dnd";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow 
} from '@mui/material';
import DragHandleIcon from '@mui/icons-material/DragHandle';

import './Table.css';

function OgTable({ columns, data, reorderFn }) {
    columns = React.useMemo(() => columns, [columns]);
    data = React.useMemo(() => data, [data]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data }, useFlexLayout);

    const onDrop = ({ from, to }) => {
        reorderFn(from, to);
    };

    let id = 0;

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
                    <Container dragHandleSelector=".drag-handle" lockAxis="y" onDrop={onDrop}>
                        {rows.map((row, i) => {
                            prepareRow(row)
                            return (
                                <Draggable key={id++}>
                                    <TableRow {...row.getRowProps()}>
                                        {reorderFn &&
                                            <div className='drag-handle'>
                                                <DragHandleIcon />
                                            </div>
                                        }
                                        {row.cells.map(cell => (
                                            <TableCell {...cell.getCellProps()}>
                                                {cell.render('Cell')}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </Draggable>
                            )
                        })}
                    </Container>
                </TableBody>
            </Table>
        </div>
    )
}

export default OgTable;
