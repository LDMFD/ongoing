import React from 'react';
import { Controller } from 'react-hook-form';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { TextField } from '@mui/material';

import { FromCanonical, ToCanonical } from 'Utils/DateTime';

import './DateSelector.css';
import { FormInputProps } from '../FormControls/FormInputProps';

interface DateControlProps extends FormInputProps {
    name: string,
}

export const DateSelector = (props: DateControlProps) => {
    let rules: any = {
        required: {
            value: props.required,
            message: 'Required field',
        },
    };

    return (
        <div className='ong-date'>
            <Controller
                name    = {props.name}
                control = {props.control}
                rules   = {rules}
                render = {({
                    field: { onChange, value },
                    fieldState: { error },
                    formState,
                }) => (
                    <>
                        <DesktopDatePicker
                            label       = {props.label}
                            inputFormat = "DD-MM-YYYY"
                            value       = {value ? FromCanonical(value) : ''}
                            onChange    = {(date: string) => onChange(ToCanonical(date))}
                            renderInput = {(params) =>
                                <TextField {...params} fullWidth />
                            }
                        />
          
                        {error?.type === 'required' &&
                            <div className='ong-form-error'>
                                {error.message}
                            </div>
                        }
                    </>
                )}
            />
        </div>
    );
}
