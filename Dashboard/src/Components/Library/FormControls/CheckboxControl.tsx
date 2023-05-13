import React from 'react';
import { Controller } from 'react-hook-form';
import {  Checkbox, FormGroup, FormControlLabel } from '@mui/material';

import './CheckboxControl.css';
import { FormInputProps } from './FormInputProps';

export interface CheckboxInputProps extends FormInputProps {
        // set to true if you want to override the input value using the `value` prop
        override?: boolean;
        value?: any,
}    

export const CheckboxControl = (props: CheckboxInputProps) => {
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
                                    checked  = {value && (!props.override || props.value)}
                                    onChange = {onChange}
                                    disabled = {props.disabled}
                                />
                            }
                        />
                    </FormGroup>
                </div>
            )}
        />
    );
};
