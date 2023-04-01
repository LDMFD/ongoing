import { DeletionConfirmation } from 'Components/Library/Confirmation/DeletionConfirmation';
import React, { useContext } from 'react';
import { useParams } from "react-router-dom";

import { Api } from 'State';
import { Context } from 'State/StateProvider'

const DeleteReview = () => {
    const [ , dispatch ] = useContext(Context);

    let { clientId, reviewId } = useParams();

    const onDelete = async () => {
        await Api.Advisor.Reviews.Delete(clientId, reviewId)
        await Api.Advisor.ClientDetail.Read(dispatch, clientId);
    };

    return (
        <DeletionConfirmation
            dryRun     = {false}
            handler    = {onDelete}
            label      = {`Delete review?`}
            prompt     = 'Are you sure you want to delete this review'
        />
    );
}

export default DeleteReview;
