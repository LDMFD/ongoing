import { Link } from 'react-router-dom';
import React from 'react'
import MaterialReactTable from 'material-react-table';

import {
    Button,
    MenuItem,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Launch from '@mui/icons-material/Launch';

import './Table.css';

export type Row = {
    original: any,
}

export interface RowAction {
    label: string,
    link: (resourceId: string) => string,
}

// Wrapper around material-react-table/TanStack table, with some specific defaults and customizations
function Table(props: {

    // Set to true to apply a custom class name to a surrounding div
    className?: string,

    // Array of column definitions, e.g. [{ id: 'name', header: 'Name', width: 200 }]
    columns: any, // TODO type

    // Array of custom row actions, e.g. [{ label: 'Edit', 
    customRowActions?: RowAction[],

    // Array of row data, e.g. [{ id: 1, name: 'Policy 1' }]
    data: any,

    // String to link to, string transformation function (for single rest entity id substitution), or function to invoke custom action
    defaultAction?: (id: string) => string | (() => string),

    // Set to false to render default action as <a> tag rather than the default react-router-dom <Link>
    defaultActionAsLink?: boolean,

    // Custom header for default action column
    defaultActionHeader?: string,

    // Custom renderer for default action; receives row data as argument (row.original from material-react-table/TanStack table)
    defaultActionRenderer?: (row: any) => any,

    // Function to invoke when delete action is selected, receives row object as argument.
    // If not provided, path is constructed from `resource` and the row's `id` column.
    deleteAction?: (id: any) => string,

    // ID of detail row to render as sub-component
    detailId?: string,

    // Custom renderer for detail row
    detailRenderer?: (row: any) => any,

    // Set to true to include delete option in row actions menu
    enableDelete?: boolean,

    // Set to true to include delete option in row actions menu
    enableEdit?: boolean,

    // Set to false to disable row actions menu
    enableRowActions?: boolean,

    // Set to false to omit table header
    enableTableHead?: boolean,

    // 1-based index of column to make flexible-width, the rest being fixed-width
    flexibleColumn?: number,

    // Label to use for add new button, typically the name of the resource to be created, e.g. 'Policy',
    // to be prefixed with 'Add new ' but in the case of toolbarCallback, the label is used as the button text.
    label?: string,

    // Render sub-component for row
    renderRowSubComponent?: any,

    // Path of resource, e.g. 'policies', used to construct links to add/edit/delete dialogs
    resource?: string,

    // Set to true to enable sticky header (experimental)
    stickyHeader?: boolean,

    // Callback for custom toolbar action
    toolbarCallback?: () => void,
}) {
    let columns = React.useMemo(() => props.columns, [props.columns]);
    let data = React.useMemo(() => props.data, [props.data]);

    // Add default action column, which is a single 'button' with a predefined or user-definable type and action/destination
    if ((props.defaultAction || props.defaultActionRenderer) && columns[columns.length - 1].id !== 'defaultAction') {
        columns.push({
            id: 'defaultAction',
            header: props.defaultActionHeader || '',
            width: 0,
            Cell: ({ row }: { row: any }) => {

                // Custom renderer
                if (props.defaultActionRenderer) {
                    return props.defaultActionRenderer(row.original);
                }

                // Plain old <a>; takes function that receives a row id (REST resource ID) and transforms it to a path (REST resource path)
                if (props.defaultActionAsLink === false) {
                    return (
                        <a href={props.defaultAction!(row.original.id) as string} className='ong-table-default-action-link'>
                            <Launch />
                        </a>
                    );
                }

                // Default action is a react-router-dom <Link>
                return (
                    <Link to={props.defaultAction!(row.original.id) as string} className='ong-table-default-action-link'>
                        <Launch />
                    </Link>
                );
            },
        });
    }

    columns = columns.map((c: any) => ({
        ...c,
        accessorKey: c.id,
        Header: c.header,
        size: c.width,
    }));

    let className = props.flexibleColumn ? `ong-table-flexible-column-${props.flexibleColumn}` : props.className;

    return (
        <div className = {className}>
            <MaterialReactTable

                // Adds a button at the top of the table, typically used to add a new resource
                renderTopToolbarCustomActions = {() => (
                    props.resource ? (
                        <Link to={{ pathname: `/${props.resource}/add` }}><Button>Add new {props.label}</Button></Link>
                    )
                    : props.toolbarCallback
                        ?
                            <Button
                                onClick = {props.toolbarCallback}
                            >
                                {props.label}
                            </Button>
                        :
                            <div className='ong-table-header'>
                                {props.label?.toUpperCase()}
                            </div>
                )}

                columns = {columns}
                data    = {data}

                initialState = {{
                    density:    'comfortable',
                    expanded:   true,
                    pagination: {
                        pageSize:  25,
                        pageIndex: 0,
                    },
                }}

                enableColumnActions     = {false}

                displayColumnDefOptions = {{
                    'mrt-row-actions': {
                        header: '',
                    },
                    'mrt-row-expand': {
                        muiTableHeadCellProps: {
                            align: 'right',
                        },
                        muiTableBodyCellProps: {
                            align: 'right',
                        },
                    },
                }}

                positionActionsColumn = "last"

                enableRowActions = {props.enableRowActions !== false}

                // The row actions menu appears at the right of the row, defaults to Edit and Delete actions but can be customized
                renderRowActionMenuItems = {({ row, closeMenu }) => {
                    // Custom
                    if (props.customRowActions) {
                        return props.customRowActions.map((action: RowAction, index) => (
                            <MenuItem key={index} sx={{ padding: 0 }} onClick={() => { closeMenu(); }}>
                                <Link
                                    // @ts-ignore
                                    to        = {action.link.bind(null, row.original.id)}
                                    className = 'ong-table-menu-action-link'
                                >
                                    <Button>
                                        {action.label}
                                    </Button>
                                </Link>
                            </MenuItem>
                        ));
                    }

                    // Built-in Edit
                    let actions = [];
                    if (props.enableEdit !== false) {
                        actions.push(
                            <MenuItem key={0} sx={{ padding: 0 }} onClick={() => { closeMenu(); }}>
                                <Link
                                    // @ts-ignore
                                    to        = {`/${props.resource}/id/${row.original.id}/edit`}
                                    className = 'ong-table-menu-action-link'
                                >
                                    <Button>
                                        <EditIcon /> Edit
                                    </Button>
                                </Link>
                            </MenuItem>
                        );
                    }

                    // Built-in Delete
                    if (props.enableDelete !== false) {
                        actions.push(
                            <MenuItem key={1} sx={{ padding: 0 }} onClick={() => { closeMenu(); }}>
                                <Link
                                    className = 'ong-table-menu-action-link'
                                    to        = {
                                        props.deleteAction
                                            ? props.deleteAction.bind(null, row.original)
                                            // @ts-ignore
                                            : `/${props.resource}/id/${row.original.id}/delete`
                                    }
                                >
                                    <Button>
                                        <DeleteIcon /> Delete
                                    </Button>
                                </Link>
                            </MenuItem>,
                        );
                    };
                    return actions;
                }}

                // The detail panel appears underneath the row (for the full width of the row)
                renderDetailPanel={
                    props.detailId
                        ? props.detailRenderer
                            ? props.detailRenderer
                            : ({ row }) => (
                                <div>
                                    {(row.original as any)[props.detailId!]}
                                </div>
                            )
                        : undefined
                }

                // enableToolbarInternalActions={false}
                enableGlobalFilter     = {false}
                enableColumnFilters    = {false}
                enableFullScreenToggle = {false}
                enableDensityToggle    = {false}
                enableHiding           = {false}
                enableTableHead        = {props.enableTableHead !== false}
            />
        </div>
    );
}

export default Table;
