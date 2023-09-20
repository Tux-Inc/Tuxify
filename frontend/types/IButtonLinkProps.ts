export interface IButtonLinkProps {
    text: string;
    icon?: string;
    iconPosition?: 'left' | 'right',
    onClick: () => void;
}