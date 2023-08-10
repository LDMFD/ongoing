import React, { useContext, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Context } from 'State/StateProvider'
import PortfolioDialog from './PortfolioDialog';
import { GoBack } from 'Utils/Routing';
import { Api } from 'State';

const EditPortfolio = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch] = useContext(Context);

    let { portfolioId } = useParams();

    const [ error, setError ] = useState(null);

    let client = state.Metadata;

    const submitHandler = async (portfolio) => {
        let response = await Api.Advisor.Portfolios.Update(client.Id, portfolio)
        if (response.error) {
            setError(response.error);
        } else {
            await Api.Advisor.ClientDetail.Read(dispatch, client.Id)
            goBack();
        }
    };

    let portfolio = state.Report.Portfolios.find(h => h.Id === portfolioId);

    return (
        <PortfolioDialog portfolio     = {portfolio}
                         state         = {state}
                         submitLabel   = 'Update'
                         submitHandler = {submitHandler}
                         error         = {error}
        />
    );
}

export default EditPortfolio;
