/// <reference types="react" />
export interface AlertDialogInterface {
    open: boolean;
    handleClose: (submit: boolean) => void;
    title: string;
    content: string;
    submitLabel?: string;
    cancelLabel?: string;
    cancelShow?: boolean;
}
export default function ConfirmDialog({ open, title, content, submitLabel, cancelLabel, handleClose, }: AlertDialogInterface): JSX.Element;
