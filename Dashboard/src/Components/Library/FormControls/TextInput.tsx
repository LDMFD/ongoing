import React from 'react';
import { Controller } from 'react-hook-form';
import { TextField } from '@mui/material';
import { FormInputProps } from './FormInputProps';

interface TextInputProps extends FormInputProps {
    type?: 'text' | 'email' | 'numeric' | 'currency',
    pattern?: object,
    autofocus?: boolean,
}

export const TextInput = (props: TextInputProps) => {
    let rules: any = {
        required: {
            value: props.required,
            message: 'Required field',
        },
    };
    switch (props.type) {
        case 'email':
            rules.pattern = {
                value: /\S+@\S+\.\S+/,
                message: 'Enter a valid email address',
            }
            break;
        
        case 'numeric':
            rules.pattern = {
                value: /^-?\d*(\.\d+)?$/,
                message: 'Enter a number',
            }
            break;

        case 'currency':
            rules.pattern = {
                value: /^-?\d*(\.\d\d)?$/,
                message: 'Enter a monetary value (pounds and optional pence)',
            }
            break;
        }
    if (props.pattern) {
        rules.pattern = props.pattern;
    }
    // Doesn't work - wipes out existing required entry. How to combine?
    // if (props.required) {
    //     rules.pattern = {
    //         value: /^(?!\s+$).*$/,   // prevent only spaces if required
    //         message: 'Required field',
    //     }
    // }

    return (
        <Controller
            name      = {props.name}
            control   = {props.control}
            rules     = {rules}
            render = {({
                field: { onChange, value },
                fieldState: { error },
                formState,
            }) => (
                <>
                    <TextField
                        autoFocus  = {props.autofocus} // TODO doesn't work
                        helperText = {error ? error.message : null}
                        size       = 'small'
                        error      = {!!error}
                        onChange   = {onChange}
                        type       = 'text'
                        value      = {value}
                        label      = {props.label}
                        variant    = 'outlined'
                        inputProps = { props.type === 'numeric' ? { inputMode: 'numeric' } : {}}
                        fullWidth
                    />
                </>
            )}
        />
    );
};
