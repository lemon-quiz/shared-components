/// <reference types="react" />
import { NodeType } from '../../Interfaces/template.interface';
interface NodeRendererInterface {
    node: NodeType;
}
export default function NodeRenderer({ node }: NodeRendererInterface): JSX.Element;
export {};
