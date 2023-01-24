import ConfirmationDialog from 'Components/Library/Confirmation/ConfirmationDialog';
import React, { useContext, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Api } from 'State';
import { Context } from 'State/StateProvider'
import { GoBack } from 'Utils/Routing';

const DeletePortfolio = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch ] = useContext(Context);
    let [ portfolio, setPortfolio ] = useState(null);

    let { clientId, portfolioId } = useParams();

    const onDelete = async (e) => {
        e.preventDefault();

        await Api.Advisor.Portfolios.Delete(clientId, portfolioId);
        await Api.Advisor.ClientDetail.Read(dispatch, clientId);

        goBack();
        return false;
    };

    if (!portfolio) {
        let p = state.Report.Portfolios.find(p => p.Id === portfolioId);
        setPortfolio(p)
        return;
    }

    return (
        <ConfirmationDialog label      = 'Delete portfolio?'
                            okCallback = {onDelete}  />
    );
}

export default DeletePortfolio;
