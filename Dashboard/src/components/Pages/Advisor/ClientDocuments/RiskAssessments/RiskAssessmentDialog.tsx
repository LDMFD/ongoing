import React, { useState} from 'react';
import { useForm } from 'react-hook-form';
import {
    Box,
    DialogContent,
    DialogContentText,
} from '@mui/material';

import FileUploader from 'Components/Library/FileHandling/FileUploader';

import Dialog from 'Components/Library/Dialog/Dialog';
import { State } from 'Types/Types';

import './RiskAssessmentDialog.css';
import { DateSelector2 } from 'Components/Library/DateSelector/DateSelector';
import { RiskAssessment } from 'Types/Client';
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
                submitLabel = {props.submitLabel}
                submitRef   = {submitRef}
                onSubmit    = {handleSubmit(onSubmit)}
                content = {
                    <DialogContent>
                        <DialogContentText>
                            Upload risk assessment document:
                        </DialogContentText>

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

                        <Box>
                            <DateSelector2
                                name     = 'Completed'
                                label    = 'Submit date'
                                control  = {control}
                                required
                            />

                            <FileUploader
                                label        = 'Risk assessment file'
                                name         = 'File'
                                control      = {control}
                                submitRef    = {submitRef}
                                required
                            />
                        </Box>

                    </DialogContent>
                }
            />
        </div>
    );
}

export default RiskAssessmentDialog;
