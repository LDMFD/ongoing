import React, { useState} from 'react';
import { useForm } from 'react-hook-form';

import FileUploader2 from 'Components/Library/FileHandling/FileUploader2';

import Dialog from 'Components/Library/Dialog/Dialog';
import { State } from 'Types/Types';

import './RiskAssessmentDialog.css';
import { DateSelector2 } from 'Components/Library/DateSelector/DateSelector';
import { RiskAssessment } from 'Types/ClientResources';
import { SelectControl } from 'Components/Library/FormControls/SelectControl';

const RiskAssessmentDialog = (props: {
    state: State,
    assessment: RiskAssessment,
    submitLabel: string,
    submitHandler: (policy: RiskAssessment) => void,
}) => {
    const { handleSubmit, control, watch } = useForm<RiskAssessment>({
        defaultValues: props.assessment },
    );

    const onSubmit = (ra: RiskAssessment) => {
        props.submitHandler(ra);
    };

    let [ levels, setLevels ] = useState([]);

    React.useEffect(() => {
        const subscription = watch((value: any, { watched, }: any) => {
            let { RiskProviderId: providerId } = value;

            let lvls = props.state.Resources.RiskLevels
                .filter(l => l.RiskProviderId === providerId)
                .map(l => ({
                    Id: l.Id,
                    Name: `${l.Level} - ${l.Label}`,
                }));
            // @ts-ignore
            setLevels(lvls);
        });
        return () => subscription.unsubscribe();
    }, [ watch, setLevels, props ]);

    let providers = props.state.Resources.RiskProviders;
    if (!levels.length && props.assessment?.RiskProviderId) {
        let lvls = props.state.Resources.RiskLevels
            .filter(l => l.RiskProviderId === props.assessment.RiskProviderId)
            .map(l => ({
                Id: l.Id,
                Name: `${l.Level} - ${l.Label}`,
            }))!;
        setLevels(lvls as any);
    }

    let submitRef = React.createRef();

    return (
        <div className   = 'riskassessment-dialog'>
            <Dialog
                title       = {`${props.submitLabel} Risk Assessment`}
                intro       = 'Upload risk assessment document:'
                submitLabel = {props.submitLabel}
                submitRef   = {submitRef}
                onSubmit    = {handleSubmit(onSubmit)}
                content = {
                    <>
                        <SelectControl
                            name     = 'RiskProviderId'
                            label    = 'Assessment Provider '
                            options  = {providers}
                            control  = {control}
                            required
                        />

                        <SelectControl
                            name    = 'RiskLevelId'
                            label   = 'Risk Level'
                            options = {levels}
                            control = {control}
                            required
                        />

                        <DateSelector2
                            name     = 'Completed'
                            label    = 'Submit date'
                            control  = {control}
                            required
                        />

                        <FileUploader2
                            label        = 'Risk assessment file'
                            name         = 'File'
                            control      = {control}
                            submitRef    = {submitRef}
                            required
                        />
                    </>
                }
            />
        </div>
    );
}

export default RiskAssessmentDialog;
