import React from 'react';
import { useForm } from 'react-hook-form';

import Dialog from 'Components/Library/Dialog/Dialog';
import { TextInput } from 'Components/Library/FormControls/TextInput';
import { UniqueViolation } from 'Errors';
import { State } from 'Types/Types';
import { RichTextEditor2 } from 'Components/Library/RichTextEditor/RichTextEditor2';

interface RiskLevelForm {
    Id: string,
    Level: string,
    Label: string,
    Desc: string,
}

const RiskLevelDialog = (props: {
    state: State,
    riskLevel: RiskLevelForm,
    submitLabel: string,
    submitHandler: (riskLevel: RiskLevelForm) => void,
    error: string,
}) => {
    const { handleSubmit, control } = useForm<RiskLevelForm>({
        defaultValues: {
            ...props.riskLevel,
        },
    });

    const onSubmit = (riskLevel: RiskLevelForm) => {
        props.submitHandler({
            ...riskLevel,
            Level: parseInt(riskLevel.Level) as unknown as string,
        });
    };

    let submitRef = React.createRef();

    return (
        <Dialog
            title       = {`${props.submitLabel} Risk Level`}
            intro       = 'Enter risk level details:'
            submitLabel = {props.submitLabel}
            submitRef   = {submitRef}
            onSubmit    = {handleSubmit(onSubmit)}
            error       = <p>{props.error === UniqueViolation ? 'This risk level already exists.' : ''}</p>

            content = {
                <>
                    <TextInput
                        required
                        type    = 'numeric'
                        name    = 'Level'
                        label   = 'Risk level (numeric)'
                        control = {control}
                    />

                    <TextInput
                        required
                        name    = 'Label'
                        label   = 'Risk level name (text label)'
                        control = {control}
                    />

                    <RichTextEditor2
                        name    = 'Desc'
                        label   = 'Description'
                        control = {control}
                    />
                </>
            }
        />
    );
}

export default RiskLevelDialog;
