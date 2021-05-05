/// <reference types="react" />
import { NodeInterface } from '../../Interfaces/template.interface';
interface SliderControlInterface {
    node: NodeInterface;
    path: number[];
    index: number;
    length: number;
}
export default function SliderControl({ node, path, index, length, }: SliderControlInterface): JSX.Element;
export {};
