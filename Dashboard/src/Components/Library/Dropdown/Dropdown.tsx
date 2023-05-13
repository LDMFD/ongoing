import { Link } from 'react-router-dom';
import * as React from 'react';
import {
    Button,
    ClickAwayListener,
    Grow,
    Paper,
    Popper,
    MenuItem,
    MenuList,
    Stack,
} from '@mui/material';
import MoreHoriz from '@mui/icons-material/MoreHoriz';

import './Dropdown.css';

interface IMenuItem {
    label: string,
    onClick?: () => void,
    link?: string,
}

const Dropdown = (props: {
    title: string,
    items: IMenuItem[],
}) => {
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef<HTMLButtonElement>(null);

    const handleToggle = () => {
        setOpen((prevOpen: any) => !prevOpen);
    };

    const handleClose = (event: Event | React.SyntheticEvent) => {
        if (
            anchorRef.current &&
            anchorRef.current.contains(event.target as HTMLElement)
        ) {
            return;
        }

        setOpen(false);
    };

    function handleListKeyDown(event: React.KeyboardEvent) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpen(false);
        } else if (event.key === 'Escape') {
            setOpen(false);
        }
    }

    // return focus to the button when we transitioned from !open -> open
    const prevOpen = React.useRef(open);
    React.useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current!.focus();
        }

        prevOpen.current = open;
    }, [open]);

    const handleSelect = (callback: () => void, event: Event | React.SyntheticEvent) => {
        handleClose(event);
        callback();
    };

    return (
        <Stack direction="row" spacing={2}>
            <Button
                ref           = {anchorRef}
                id            = "composition-button"
                variant       = 'outlined'
                aria-controls = {open ? 'composition-menu' : undefined}
                aria-expanded = {open ? 'true' : undefined}
                aria-haspopup = "true"
                onClick       = {handleToggle}
            >
                {props.title} &nbsp;
                <MoreHoriz />
            </Button>
            <Popper
                open      = {open}
                anchorEl  = {anchorRef.current}
                role      = {undefined}
                placement = "bottom-start"
                transition
                disablePortal
            >
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                            transformOrigin:
                                placement === 'bottom-start' ? 'left top' : 'left bottom',
                        }}
                    >
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList
                                    autoFocusItem   = {open}
                                    id              = "composition-menu"
                                    aria-labelledby = "composition-button"
                                    onKeyDown       = {handleListKeyDown}
                                >
                                    {props.items.map((item: IMenuItem, index: number) => (
                                        item.link === undefined ?
                                            <MenuItem
                                                key     = {index}
                                                onClick = {handleSelect.bind(null, item.onClick!)}
                                            >
                                                {item.label}
                                            </MenuItem>
                                        :
                                            <MenuItem key={index} onClick={handleClose}>
                                                <Link to={item.link} className='ong-downdown-link'>
                                                    {item.label}
                                                </Link>
                                            </MenuItem>
                                    ))}
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </Stack>
    );
}

export default Dropdown;
