export interface IButtonLinkProps {
    text?: string;
    icon?: string;
    size?: 'small' | 'medium' | 'large',
    iconPosition?: 'left' | 'right',
    tooltip?: string,
    customClass?: string,
    onClick: () => void;
}