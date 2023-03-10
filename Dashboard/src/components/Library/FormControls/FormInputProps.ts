export interface FormInputProps {
    name: string; // The key on defaultValues
    control: any;
    label: string;
    setValue?: any;
    required?: boolean;
    disabled?: boolean;
}
