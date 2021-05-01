import * as React from 'react';
declare const AppContext: React.Context<any>;
export declare function withAppContext<T>(Component: React.ComponentType<T>): (props: any) => JSX.Element;
export declare const AppProvider: React.Provider<any>;
export declare const AppConsumer: React.Consumer<any>;
export default AppContext;
