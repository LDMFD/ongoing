import React, { useContext, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Context } from 'State/StateProvider'
import { SET_FUNDS } from 'State/Reducer';
import FundDialog from './FundDialog';
import { GoBack } from 'Utils';

const EditFund = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch ] = useContext(Context);
    let [ fund, setFund ] = useState(null);

    let { fundId } = useParams();
    fundId = parseInt(fundId);

    if (!fund) {
        let p = state.Funds.find(p => p.Id === fundId);
        if (!p) {
            return <>Fund not found</>;
        }
        setFund(p)
        return;
    }

    const submitHandler = (e) => {
        e.preventDefault();
        window.ApiClient.put(`advisor/funds/${fundId}`, {
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
                    submitLabel   = 'Update'
                    submitHandler = {submitHandler}  />
    );
}

export default EditFund;
