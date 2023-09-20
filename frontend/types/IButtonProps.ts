export interface IButtonProps {
    text: string;
    type: 'primary' | 'secondary' | 'danger' | 'warning' | 'success' | 'info',
    outlined?: boolean,
    size?: 'small' | 'medium' | 'large',
    state?: 'idle' | 'loading' | 'disabled',
    icon?: string,
    iconPosition?: 'left' | 'right',
    onClick: () => void
}