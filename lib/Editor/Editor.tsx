import React, {
  useEffect, useState,
} from 'react';

import {
  NodeType, PageInterface,
} from '../Interfaces/template.interface';
import { EditorContext } from './EditorContext';
import NodeWrapper from './nodes/NodeWrapper';
import Parser from './parser';

interface EditorInterface {
  parser: Parser;
  page: PageInterface;
  customNodes?: {
    [key: string]: React.JSXElementConstructor<any>
  }
}

export default function Editor({
  parser,
  page,
  customNodes,
}: EditorInterface) {
  const [state, setState] = useState([]);

  useEffect(() => {
    setState(page);
  }, [JSON.stringify(page)]);

  const moveUp = (path: number[], index: number): void => {
    setState(parser.moveUp(path, index));
  };

  const moveDown = (path: number[], index: number): void => {
    setState(parser.moveDown(path, index));
  };

  const canMoveUp = (path: number[], index: number, type: string, name: string): boolean => parser.canMoveUp(path, index, type, name);
  const canMoveDown = (path: number[], index: number, type: string, name: string): boolean => parser.canMoveDown(path, index, type, name);
  const canDelete = (path: number[]): boolean => parser.canDelete(path);
  const canAdd = (path: number[]): boolean => parser.canAdd(path);
  const addNode = (path: number[], index: number, amount?: number): void => {
    setState(parser.addNode(path, index, amount));
  };
  const deleteNode = (path: number[], amount?: number) => {
    setState(parser.deleteNode(path, amount));
  };
  const setValue = (id: string, value: any, errors?: any): void => parser.setValue(id, value, errors);
  const getValue = (id: string, value: any, errors: any): any => parser.getValue(id, value, errors);
  const validateNode = (node: NodeType, value?: any): any => parser.validateNode(node, value);
  const hasCustomNode = (type: string): boolean => !!customNodes[type];
  const getCustomNode = (type: string): React.JSXElementConstructor<any> => customNodes[type];
  const getSiblings = (path) => parser.getSiblings(path);

  return (
    <EditorContext.Provider value={{
      moveUp,
      canMoveUp,
      moveDown,
      canMoveDown,
      canAdd,
      addNode,
      canDelete,
      deleteNode,
      setValue,
      getValue,
      validateNode,
      hasCustomNode,
      getCustomNode,
      getSiblings,
    }}
    >

      {state.map((node, index: number) => (
        <NodeWrapper
          key={node.uuid || node.tuuid}
          index={index}
          node={node}
          path={[index]}
          length={state.length}
        />
      ))}
    </EditorContext.Provider>
  );
}
