import React from 'react';
export default function AuthGuard({ children }: {
    children: (params: any) => React.ReactElement;
}): JSX.Element;
