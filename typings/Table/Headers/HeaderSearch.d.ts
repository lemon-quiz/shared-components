/// <reference types="react" />
interface HeaderSearchInterface {
    column: string;
    label: string;
    prefix?: string;
    sortable?: boolean;
}
export default function HeaderSearch({ column, label, prefix, sortable, }: HeaderSearchInterface): JSX.Element;
export {};
