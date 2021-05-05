import React from 'react';
import Parser from './parser';
interface EditorInterface {
    parser: Parser;
    render: typeof React.Component;
}
export default function Editor({ parser, render: ButtonBar, }: EditorInterface): JSX.Element;
export {};
