import React from 'react';
import { Controller } from 'react-hook-form';
import {  Slider, FormGroup, FormControlLabel } from '@mui/material';

import './CheckboxControl.css';
import { FormInputProps } from './FormInputProps';

interface SliderControlProps extends FormInputProps {
    min: number,
    max: number,
    step: number,
    disabled?: boolean,
    marks?: any[] | boolean | undefined,
}
export const SliderControl = (props: SliderControlProps) => {
    return (
        <Controller
            name    = {props.name}
            control = {props.control}
            render = {({
                field: { onChange, value },
                fieldState: { error },
                formState,
            }) => (
                <div className='ong-slider'>
                    <FormGroup>
                        <FormControlLabel
                            label = {props.label}
                            control = {
                                <Slider
                                    disabled          = {props.disabled}
                                    value             = {props.disabled ? 0 : value}
                                    valueLabelDisplay = "on"
                                    valueLabelFormat  = {(value: number) => `${value}%`}
                                    min               = {props.min}
                                    max               = {props.max}
                                    step              = {props.step}
                                    onChange          = {value => { onChange(value) }}
                                    marks             = {props.marks ?? true}
                                />
                            }
                        />
                    </FormGroup>
                </div>
            )}
        />
    );
};
