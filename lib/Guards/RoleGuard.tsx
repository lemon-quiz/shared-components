import React, {ReactElement, useContext} from 'react';

import AppContext from '../AppContext';
import {ServicesInterface} from '../Interfaces/services.interface';
import {ExpectedRoleType} from "../Interfaces/expected-role.interface";

interface AccessInterface {
    children: ReactElement;
    expectedRole: ExpectedRoleType;

    [key: string]: any;
}

export default function RoleGuard({children, expectedRole = [], ...rest}: AccessInterface) {
    const {accountsService} = useContext<ServicesInterface>(AppContext);
    const access = accountsService.hasAccess(expectedRole);

    if (!access) {
        return <></>;
    }

    return React.cloneElement(children, rest);
}
