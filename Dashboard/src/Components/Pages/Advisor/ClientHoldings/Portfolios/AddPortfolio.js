import React, { useContext, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Context } from 'State/StateProvider'
import { DefaultPortfolio } from './DefaultPortfolio';
import PortfolioDialog from './PortfolioDialog';
import { GoBack } from 'Utils/Routing';
import { Api } from 'State';

const AddPortfolio = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    let { clientId } = useParams();

    const [ state, dispatch ] = useContext(Context);

    const [ error, setError ] = useState(null);

    const submitHandler = async (portfolio) => {
        let response = await Api.Advisor.Portfolios.Create(clientId, portfolio);
        if (response.error) {
            setError(response.error);
        } else {
            await Api.Advisor.ClientDetail.Read(dispatch, clientId);
            goBack();
        }
    };
    
    return (
        <PortfolioDialog portfolio     = {DefaultPortfolio}
                         state         = {state}
                         submitLabel   = 'Add'
                         submitHandler = {submitHandler}
                         error         = {error}
        />
    );
}

export default AddPortfolio;
