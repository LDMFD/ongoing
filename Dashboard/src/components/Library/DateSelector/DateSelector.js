import React from 'react';

import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

import { FromCanonical, ToCanonical } from 'Utils/DateTime';

import './DateSelector.css';

export const DateSelector = ({ selected, onChange, label='Date' }) => {
    return (
        <div>
            <b>{label}:</b>
            <DatePicker dateFormat       = {'dd/MM/yyyy'}
                        calendarStartDay = {1}
                        selected         = {FromCanonical(selected)}
                        onChange         = {(date) => onChange(ToCanonical(date))} 
                        fixedHeight 
                        popperPlacement="bottom-start" />
            <br />
            <br />
        </div>
    );
}