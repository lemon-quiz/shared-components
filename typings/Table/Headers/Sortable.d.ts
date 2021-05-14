/// <reference types="react" />
export interface SortableInterface {
    column: string;
    prefix?: string;
}
export default function Sortable({ column, prefix, }: SortableInterface): JSX.Element;
