import * as React from 'react';

const AppContext = React.createContext<any>({});

export function withAppContext<T>(Component: React.ComponentType<T>) {
  return (props: any) => (
    <AppContext.Consumer>
      {(context) => (
        <Component context={context} {...props} />)}
    </AppContext.Consumer>
  );
}

export const AppProvider = AppContext.Provider;
export const AppConsumer = AppContext.Consumer;
export default AppContext;
