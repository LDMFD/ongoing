import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from "react-router-dom";
import Dialog from 'Components/Library/Dialog/Dialog';

import { Api } from 'State';
import { Context } from 'State/StateProvider'
import { DateSelector } from 'Components/Library/DateSelector/DateSelector';
import { GoBack } from 'Utils/Routing';
import { State } from 'Types/Types';

interface EditReviewDatesFormInput {
    StartDate: string,
    EndDate: string,
}

const EditDatesDialogInternal = (props: {
    state: State,
    reviewDates: EditReviewDatesFormInput,
    submitLabel: string,
    submitHandler: (policy: EditReviewDatesFormInput) => void,
}) => {
    const { handleSubmit, control } = useForm<EditReviewDatesFormInput>({
        defaultValues: props.reviewDates },
    );

    const onSubmit = (reviewDates: EditReviewDatesFormInput) => {
        props.submitHandler(reviewDates);
    };

    let submitRef = React.createRef();

    return (
        <div className   = 'reviewDates-dialog'>
            <Dialog
                title       = {`${props.submitLabel} Review Period`}
                intro       = 'Set review dates:'
                submitLabel = {props.submitLabel}
                submitRef   = {submitRef}
                onSubmit    = {handleSubmit(onSubmit)}
                content = {
                    <>
                        <DateSelector
                                name     = 'StartDate'
                                label    = 'Start date'
                                control  = {control}
                                required
                            />

                        <DateSelector
                                name     = 'EndDate'
                                label    = 'End date'
                                control  = {control}
                                required
                            />
                    </>
                }
            />
        </div>
    );
}

const EditDatesDialog = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch ] = useContext(Context);

    let clientId = state.Metadata.Id;

    const submitHandler = async (draft: any) => {
        await Api.Advisor.Reviews.Update(clientId, draft);
        await Api.Advisor.ClientDetail.Read(dispatch, clientId);
        goBack();
    };

    return (
        <EditDatesDialogInternal
            reviewDates   = {state.Draft}
            state         = {state}
            submitLabel   = 'Update'
            submitHandler = {submitHandler}
        />
    );
}

export default EditDatesDialog;
