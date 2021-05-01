import React, { useContext } from 'react';

import AppContext from '../AppContext';
import {ServicesInterface} from "../Interfaces/services.interface";

export default function AuthGuard({ children }: { children: (params: any) => React.ReactElement }) {
  const { storeService } = useContext<ServicesInterface>(AppContext);

  if (!storeService.has('AccountsService', 'profile')) {
    return (<div>unauthorized</div>);
  }

  return (
    <>
      {children({ x: 'y' })}
    </>
  );
}
