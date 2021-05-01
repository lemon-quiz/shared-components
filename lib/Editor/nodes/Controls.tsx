/* eslint-disable import/no-extraneous-dependencies */
import { IconButton } from '@material-ui/core';
import { AddBox, ArrowDropDown, Delete } from '@material-ui/icons';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import React, { useContext, useEffect, useState } from 'react';

import { NodeType } from '../../Interfaces/template.interface';
import { EditorContext, EditorContextInterface } from '../EditorContext';

export default function Controls({
  node,
  index,
  path,
  length,
}: { node: NodeType, index: number, path: number[], length: number }) {
  const pageContext = useContext<EditorContextInterface>(EditorContext);
  const [state, setState] = useState({
    canMoveUp: false,
    canMoveDown: false,
    canAdd: false,
    canDelete: false,
  });

  const moveUp = () => {
    pageContext.moveUp(path);
  };

  const moveDown = () => {
    pageContext.moveDown(path);
  };

  const addNode = () => {
    if (node.uuid) {
      pageContext.addNode(path, index);

      return;
    }

    pageContext.addNode(path);
  };

  const deleteNode = () => {
    pageContext.deleteNode(path);
  };

  useEffect(() => {
    setState({
      canMoveUp: pageContext.canMoveUp(path, index, node.type, node.name),
      canMoveDown: pageContext.canMoveDown(path, index, node.type, node.name),
      canAdd: pageContext.canAdd(path),
      canDelete: pageContext.canDelete(path),
    });
  }, [index, length]);

  return (
    <>
      <IconButton
        onClick={moveUp}
        disabled={!state.canMoveUp}
        component="span"
        color="primary"
        size="small"
      >
        <ArrowDropUpIcon />
      </IconButton>
      <IconButton
        onClick={moveDown}
        disabled={!state.canMoveDown}
        component="span"
        color="primary"
        size="small"
      >
        <ArrowDropDown />
      </IconButton>
      <IconButton
        onClick={addNode}
        disabled={!state.canAdd}
        component="span"
        color="primary"
        size="small"
      >
        <AddBox />
      </IconButton>
      <IconButton
        onClick={deleteNode}
        disabled={!state.canDelete}
        component="span"
        color="primary"
        size="small"
      >
        <Delete />
      </IconButton>
    </>
  );
}
