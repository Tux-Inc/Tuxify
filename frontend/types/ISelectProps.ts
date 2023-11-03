export type ISelectOptionsProps = {
    name: string;
    label: string;
    value: string;
    icon?: string;
    click?: () => void;
};

export type ISelectProps = {
    label: string;
    name: string;
    id: string;
    options: Array<ISelectOptionsProps>;
    "option-attribute": string;
};
