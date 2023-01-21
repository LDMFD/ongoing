import React from 'react';
import { useForm } from 'react-hook-form';

import { State } from 'Types/Types';
import Dialog from 'Components/Library/Dialog/Dialog';
import { RichTextEditor2 } from 'Components/Library/RichTextEditor/RichTextEditor2';

import { ModuleTypeSelectSpec } from 'State/ApiCommands/OrgResources/Reviews/ModuleTypes';
import { SelectControl } from 'Components/Library/FormControls/SelectControl';

interface ModulePresetFormInput {
    ModuleType: string,
    Text: string,
}

const ModulePresetDialog = (props: {
    state: State,
    preset: ModulePresetFormInput,
    submitLabel: string,
    submitHandler: (preset: ModulePresetFormInput) => void,
}) => {
    const { handleSubmit, control } = useForm<ModulePresetFormInput>({
        defaultValues: props.preset,
    });

    const onSubmit = (preset: ModulePresetFormInput) => {
        props.submitHandler(preset);
    };

    let presetList = Object.keys(ModuleTypeSelectSpec).map((m:any) => ModuleTypeSelectSpec[m]).map(m => ({
        Id: m.id,
        Name: m.label,
    }));

    let submitRef = React.createRef();
    
    return (
        <Dialog
            title       = {props.submitLabel + ' Module Preset' /* TODO refactor this with the enum */ }
            intro       = 'Enter Module Preset details:'
            submitLabel = {props.submitLabel}
            submitRef   = {submitRef}
            onSubmit    = {handleSubmit(onSubmit)}
            content = {
                <>
                    {props.submitLabel.toLowerCase() === 'add' &&  // TODO submitLabel should be an enum
                        <SelectControl
                            name    = 'ModuleType'
                            options = {presetList}
                            label   = 'Module Preset'
                            control = {control}
                            required
                        />
                    }

                    <RichTextEditor2
                        name      = 'Text'
                        label     = 'Preset text'
                        control   = {control}
                        submitRef = {submitRef}
                        required
                    />
                </>
            }
        />
    );
};

export default ModulePresetDialog;
