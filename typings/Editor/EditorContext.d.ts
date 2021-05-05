import React from 'react';
import { NodeType } from '../Interfaces/template.interface';
export declare const EditorContext: React.Context<any>;
export interface EditorContextInterface {
    moveUp: (path: number[], index?: number) => void;
    canMoveUp: (path: number[], index: number, type: string, name: string) => boolean;
    moveDown: (path: number[], index?: number) => void;
    canMoveDown: (path: number[], index: number, type: string, name: string) => boolean;
    canAdd: (path: number[]) => boolean;
    addNode: (path: number[], index?: number) => void;
    canDelete: (path: number[]) => boolean;
    deleteNode: (path: number[]) => void;
    getValue: (id: string, defaultValue?: any, defaultErrors?: any) => any;
    setValue: (id: string, value: any, errors?: any) => void;
    validateNode: (node: NodeType, value?: any) => any;
}
