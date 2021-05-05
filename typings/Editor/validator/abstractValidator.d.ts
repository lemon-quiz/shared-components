import { NodeType } from '../../Interfaces/template.interface';
declare abstract class AbstractValidator {
    abstract checkInput(node: NodeType, value?: string): any;
}
export default AbstractValidator;
