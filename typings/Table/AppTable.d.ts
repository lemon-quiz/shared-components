import { ReactNode } from 'react';
import { PaginatedResources } from '../Interfaces/PaginatedResources';
export interface AppTableInterface<T = any> {
    children: ReactNode;
    resource: PaginatedResources<T>;
    prefix?: string;
}
export default function AppTable<T = any>({ children, resource, prefix, }: AppTableInterface<T>): JSX.Element;
