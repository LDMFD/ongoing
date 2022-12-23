import React from 'react';
import { Controller } from 'react-hook-form';
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { FormInputProps } from './FormInputProps';

import './SelectControl.css';

interface PolicyTypeMenuItem {
    Id: string,
    Name: string,
}

interface SelectControlProps extends FormInputProps {
    options: PolicyTypeMenuItem[],
}

export const SelectControl = (props: SelectControlProps) => {
    let rules: any = {
        required: {
            value: props.required,
            message: 'Required field',
        },
    };

    return (
        <Controller
            name    = {props.name}
            control = {props.control}
            rules   = {rules}
            render = {({
                field: { onChange, value },
                fieldState: { error },
                formState,
            }) => (
                <div className='ong-select'>
                    <FormControl error={!!error}>
                        <InputLabel htmlFor={props.name}>{props.label}</InputLabel>
                        <Select labelId  = {props.name}
                                value    = {value || ''}
                                onChange = {onChange}
                                name     = {props.name}
                                label    = {props.label}
                                type     = 'text'>
                            {props.options.map(o => (
                                <MenuItem value={o.Id} key={o.Id}>
                                    {o.Name}
                                </MenuItem>
                            ))}
                        </Select>
                        {error &&
                            <FormHelperText>{error.message}</FormHelperText>
                        }
                    </FormControl>
                </div>
            )}
        />
    );
};
