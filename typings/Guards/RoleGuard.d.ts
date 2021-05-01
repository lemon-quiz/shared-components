import { ReactElement } from 'react';
import { ExpectedRoleType } from "../Interfaces/expected-role.interface";
interface AccessInterface {
    children: ReactElement;
    expectedRole: ExpectedRoleType;
    [key: string]: any;
}
export default function RoleGuard({ children, expectedRole, ...rest }: AccessInterface): JSX.Element;
export {};
