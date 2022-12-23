import React from "react";
import { Controller } from "react-hook-form";
import { TextField } from "@mui/material";
import { FormInputProps } from "./FormInputProps";

interface TextInputProps extends FormInputProps {
    type?: 'text' | 'email' | 'numeric',
}

export const TextInput = (params: TextInputProps) => {
    let {
        name,
        control,
        label,
        required,
        type } = params;
    let rules: any = {
        required: {
            value: required,
            message: 'This field is required',
        },
    };
    switch (type) {
        case 'email':
            rules.pattern = {
                value: /\S+@\S+\.\S+/,
                message: 'Enter a valid email address',
            }
            break;
        
        case 'numeric':
            rules.pattern = {
                value: /^-?\d*(\.\d+)?$/,
                message: 'Enter a valid number',
            }
            break;
    }

    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({
                field: { onChange, value },
                fieldState: { error },
                formState,
            }) => (
                <TextField helperText = {error ? error.message : null}
                           size       = "small"
                           error      = {!!error}
                           onChange   = {onChange}
                           type       = {'text'}
                           value      = {value}
                           label      = {label}
                           variant    = "outlined"
                           inputProps = { type === 'numeric' ? { inputMode: 'numeric' } : {}}
                           fullWidth
                />
            )}
        />
    );
};
