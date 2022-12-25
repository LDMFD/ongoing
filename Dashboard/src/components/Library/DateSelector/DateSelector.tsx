import React from 'react';
import { Controller } from 'react-hook-form';

// @ts-ignore
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

import { FromCanonical, ToCanonical } from 'Utils/DateTime';

import './DateSelector.css';
import { FormInputProps } from '../FormControls/FormInputProps';

export const DateSelector = ({ selected, onChange, label='Date' }: any) => {
    return (
        <div>
            <b>{label}:</b>
            <DatePicker dateFormat       = {'dd/MM/yyyy'}
                        calendarStartDay = {1}
                        selected         = {FromCanonical(selected)}
                        onChange         = {(date: string) => onChange(ToCanonical(date))} 
                        fixedHeight 
                        popperPlacement="bottom-start" />
            <br />
            <br />
        </div>
    );
}

export const DateSelector2 = (props: FormInputProps) => {
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
                        <div className='ong-date-label'>
                            {props.label}
                        </div>

                        <DatePicker
                            dateFormat       = {'dd/MM/yyyy'}
                            calendarStartDay = {1}
                            selected         = {value ? FromCanonical(value) : ''}
                            onChange         = {(date: string) => onChange(ToCanonical(date))} 
                            fixedHeight 
                            popperPlacement  = "bottom-start"
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
