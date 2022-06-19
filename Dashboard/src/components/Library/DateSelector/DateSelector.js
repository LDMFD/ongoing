import React from 'react';

import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

import { FromCanonical, ToCanonical } from 'Utils/DateTime';

export const DateSelector = ({ selected, onChange }) => {
    return (
        <>
            <b>Date:</b>
            <DatePicker dateFormat       = {'dd/MM/yyyy'}
                        calendarStartDay = {1}
                        selected         = {FromCanonical(selected)}
                        onChange         = {(date) => onChange(ToCanonical(date))} />
            <br />
            <br />
        </>
    );
}