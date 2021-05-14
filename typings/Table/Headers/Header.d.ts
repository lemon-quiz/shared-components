/// <reference types="react" />
interface HeaderInterface {
    column: string;
    label: string;
    prefix?: string;
    sortable?: boolean;
}
export default function Header({ column, label, prefix, sortable, }: HeaderInterface): JSX.Element;
export {};
