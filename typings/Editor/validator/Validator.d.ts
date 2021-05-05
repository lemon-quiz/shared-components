import { NodeType } from '../../Interfaces/template.interface';
import AbstractValidator from './AbstractValidator';
declare class Validator extends AbstractValidator {
    private readonly validatorLib;
    constructor(validatorLib: any);
    checkInput(node: NodeType, value?: string): any;
}
export default Validator;
