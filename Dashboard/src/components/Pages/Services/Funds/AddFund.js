import React, { useContext, useState } from 'react';
import { useHistory,  } from "react-router-dom";

import { Context } from 'Store'
import { SET_FUNDS } from 'Reducer';
import DefaultFund from './DefaultFund';
import FundDialog from './FundDialog';
import { GoBack } from 'Utils';

const AddFund = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [, dispatch] = useContext(Context);

    let [ fund, setFund ] = useState(DefaultFund);

    const submitHandler = (e) => {
        e.preventDefault();
        window.ApiClient.post(`/funds`, {
            ...fund
        }).then(_ => {
            return window.ApiClient.get(`/funds`).then(res => {
                dispatch({
                    type: SET_FUNDS,
                    payload: res.data,
                })
            }).then(goBack);;
        });
        return false;
    };

    return (
        <FundDialog fund          = {fund}
                    setFund       = {setFund}
                    submitLabel   = 'Add'
                    submitHandler = {submitHandler}  />
    );
}

export default AddFund;
