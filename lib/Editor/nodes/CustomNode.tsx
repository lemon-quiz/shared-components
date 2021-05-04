import React, { useContext } from 'react';

import { CustomNodeInterface } from '../../Interfaces/template.interface';
import { EditorContext, EditorContextInterface } from '../EditorContext';

interface CustomNodePageInterface {
  node: CustomNodeInterface
}

export default function CustomNode({ node }: CustomNodePageInterface) {
  const editorContext = useContext<EditorContextInterface>(EditorContext);
  const { type } = node;

  const RenderNode = editorContext.getCustomNode(type);

  if (!RenderNode) {
    return <></>;
  }

  return <RenderNode node={node} />;
}
