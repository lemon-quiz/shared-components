import { NodeType, ValidatiorOptions } from '../../Interfaces/template.interface';
import AbstractValidator from './abstractValidator';

class Validator extends AbstractValidator {
  private readonly validatorLib;

  constructor(validatorLib) {
    super();
    this.validatorLib = validatorLib;
  }

  public checkInput(node: NodeType, value?: string) {
    let { validator } = node;
    const errors: any = {};

    if (node.mandatory && !(value ?? node.value) && !node.allowEmpty) {
      errors.isEmpty = true;
    }

    if (typeof validator === 'undefined') {
      return Object.keys(errors).length === 0 ? null : errors;
    }

    if (!Array.isArray(validator)) {
      validator = [validator];
    }

    validator.forEach((validationRule: string) => {
      let rule = validationRule;
      let params = [];
      if (typeof validationRule === 'object') {
        rule = (validationRule as ValidatiorOptions).rule;
        params = (validationRule as ValidatiorOptions).params;
      }

      if (typeof this.validatorLib[rule] === 'undefined') {
        console.error(`Validation rule ${rule} was not found in the validator library`);
        return;
      }

      if (!this.validatorLib[rule](String((value ?? node.value)), ...params)) {
        errors[validationRule] = false;
      }
    });

    return Object.keys(errors).length === 0 ? null : errors;
  }
}

export default Validator;
