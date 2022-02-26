import React, { useContext, useState } from 'react';
import { useHistory,  } from "react-router-dom";

import { Context } from 'State/StateProvider'
import { SET_FUNDS } from 'State/Reducer';
import DefaultFund from './DefaultFund';
import FundDialog from './FundDialog';
import { GoBack } from 'Utils/Routing';

const AddFund = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [, dispatch] = useContext(Context);

    let [ fund, setFund ] = useState(DefaultFund);

    const submitHandler = (e) => {
        e.preventDefault();
        window.ApiClient.post(`advisor/funds`, {
            ...fund
        }).then(_ => {
            return window.ApiClient.get(`advisor/funds`).then(res => {
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
