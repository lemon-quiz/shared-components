import React from 'react';
import { Observable } from 'rxjs';
import { NodeType, PageInterface } from '../Interfaces/template.interface';
export declare const EditorContext: React.Context<any>;
export interface EditorContextInterface {
    moveUp: (path: number[], index?: number) => void;
    canMoveUp: (path: number[], index: number, type: string, name: string) => boolean;
    moveDown: (path: number[], index?: number) => void;
    canMoveDown: (path: number[], index: number, type: string, name: string) => boolean;
    canAdd: (path: number[]) => boolean;
    addNode: (path: number[], index?: number, amount?: number) => void;
    canDelete: (path: number[]) => boolean;
    deleteNode: (path: number[], amount?: number) => void;
    getValue: (id: string, defaultValue?: any, defaultErrors?: any) => any;
    setValue: (id: string, value: any, errors?: any) => void;
    validateNode: (node: NodeType, value?: any) => any;
    hasCustomNode: (type: string) => boolean;
    getCustomNode: (type: string) => React.JSXElementConstructor<any>;
    getSiblings: (path: number[]) => NodeType[] | [];
    show: (equation: string, path: any) => boolean;
    getEquationNodeIds: (equation: string, path: any) => string[];
    onValueChanges: Observable<any>;
    onTreeChanges: Observable<any>;
    page: Observable<PageInterface>;
}
