import { NodeType } from '../../Interfaces/template.interface';

abstract class AbstractValidator {
  public abstract checkInput(node: NodeType, value?: string);
}

export default AbstractValidator;
