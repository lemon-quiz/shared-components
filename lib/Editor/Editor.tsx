import React, { useState } from 'react';

import { NodeType } from '../Interfaces/template.interface';
import { EditorContext } from './EditorContext';
import NodeWrapper from './nodes/NodeWrapper';
import Parser from './parser';

interface EditorInterface {
  parser: Parser;
  render: typeof React.Component
}

export default function Editor({
  parser,
  render: ButtonBar,
}: EditorInterface) {
  const [state, setState] = useState([]);

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
  const addNode = (path: number[], index: number): void => {
    setState(parser.addNode(path, index));
  };
  const deleteNode = (path: number[]) => {
    setState(parser.deleteNode(path));
  };
  const setValue = (id: string, value: any, errors?: any): void => parser.setValue(id, value, errors);
  const getValue = (id: string, value: any, errors: any): any => parser.getValue(id, value, errors);
  const validateNode = (node: NodeType, value?: any): any => parser.validateNode(node, value);

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
      <ButtonBar parser={parser} />
    </EditorContext.Provider>
  );
}
