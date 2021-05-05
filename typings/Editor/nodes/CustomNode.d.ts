/// <reference types="react" />
import { CustomNodeInterface } from '../../Interfaces/template.interface';
interface CustomNodePageInterface {
    node: CustomNodeInterface;
}
export default function CustomNode({ node }: CustomNodePageInterface): JSX.Element;
export {};
