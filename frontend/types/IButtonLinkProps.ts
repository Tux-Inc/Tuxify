export interface IButtonLinkProps {
    text: string;
    icon?: string;
    size?: 'small' | 'medium' | 'large',
    iconPosition?: 'left' | 'right',
    onClick: () => void;
}