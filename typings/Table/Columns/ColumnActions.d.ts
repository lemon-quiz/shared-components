/// <reference types="react" />
import { ColumnInterface } from '../TableInterface';
interface ColumnActionsInterface<T = any> extends ColumnInterface {
    handleDelete?: (record: T) => void;
    path?: string;
    requiredRole?: string;
}
export default function ColumnActions({ align, record, column, path, handleDelete, requiredRole, }: ColumnActionsInterface): JSX.Element;
export {};
