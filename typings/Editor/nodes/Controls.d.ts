/// <reference types="react" />
import { NodeType } from '../../Interfaces/template.interface';
export default function Controls({ node, index, path, length, }: {
    node: NodeType;
    index: number;
    path: number[];
    length: number;
}): JSX.Element;
