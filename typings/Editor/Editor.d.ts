import React from 'react';
import { PageInterface } from '../Interfaces/template.interface';
import Parser from './parser';
interface EditorInterface {
    parser: Parser;
    page: PageInterface;
    customNodes?: {
        [key: string]: React.JSXElementConstructor<any>;
    };
}
export default function Editor({ parser, page, customNodes, }: EditorInterface): JSX.Element;
export {};
