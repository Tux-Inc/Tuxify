export interface IButtonProps {
    text: string;
    type: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'warning' | 'success' | 'info',
    size?: 'small' | 'medium' | 'large',
    state?: 'idle' | 'loading' | 'disabled',
    icon?: string,
    iconPosition?: 'left' | 'right',
    onClick: () => void
}