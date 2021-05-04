import { useContext } from 'react';

import {
  CheckboxInterface, CustomNodeInterface, NodeType, RadioInterface, SelectBoxInterface, TextareaInterface,
} from '../../Interfaces/template.interface';
import { EditorContext, EditorContextInterface } from '../EditorContext';
import CheckboxNode from './CheckboxNode';
import CustomNode from './CustomNode';
import LineNode from './LineNode';
import RadioNode from './RadioNode';
import SelectNode from './SelectNode';
import TextareaNode from './TextareaNode';

interface NodeRendererInterface {
  node: NodeType;
}

export default function NodeRenderer({ node }: NodeRendererInterface) {
  const { type } = node;
  const context = useContext<EditorContextInterface>(EditorContext);

  if (type === 'line') {
    return <LineNode node={node} />;
  }

  if (type === 'radio') {
    return <RadioNode node={node as RadioInterface} />;
  }

  if (type === 'checkbox') {
    return <CheckboxNode node={node as CheckboxInterface} />;
  }

  if (type === 'select') {
    return <SelectNode node={node as SelectBoxInterface} />;
  }

  if (type === 'textarea') {
    return <TextareaNode node={node as TextareaInterface} />;
  }

  if (context.hasCustomNode(type)) {
    return <CustomNode node={node as CustomNodeInterface} />;
  }

  return (<div>Not implemented!</div>);
}
