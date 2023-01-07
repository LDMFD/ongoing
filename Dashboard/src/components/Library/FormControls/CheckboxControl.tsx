import React from 'react';
import { Controller } from 'react-hook-form';
import {  Checkbox, FormGroup, FormControlLabel } from '@mui/material';

import './CheckboxControl.css';
import { FormInputProps } from './FormInputProps';

export const CheckboxControl = (props: FormInputProps) => {
    return (
        <Controller
            name    = {props.name}
            control = {props.control}
            render = {({
                field: { onChange, value },
                fieldState: { error },
                formState,
            }) => (
                <div className='ong-checkbox'>
                    <FormGroup>
                        <FormControlLabel
                            label = {props.label}
                            control = {
                                <Checkbox
                                    checked  = {value}
                                    onChange = {onChange}
                                />
                            }
                        />
                    </FormGroup>
                </div>
            )}
        />
    );
};
