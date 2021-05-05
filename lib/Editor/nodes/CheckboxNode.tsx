import {
  Checkbox,
  FormControl, FormControlLabel, FormGroup,
  FormHelperText,
} from '@material-ui/core';
import React, {
  ChangeEvent, useContext, useEffect, useState,
} from 'react';

import { CheckboxInterface } from '../../Interfaces/template.interface';
import { EditorContext, EditorContextInterface } from '../EditorContext';

export default function CheckboxNode({ node }: { node: CheckboxInterface }) {
  const pageContext = useContext<EditorContextInterface>(EditorContext);
  const [value, setValue] = useState<any>(false);
  const [errors, setErrors] = useState<any>(null);

  useEffect(() => {
    const {
      uuid,
      value: defaultValue,
      errors: defaultErrors,
    } = node;

    const { value: initValue, errors: initErrors } = pageContext.getValue(uuid, defaultValue, defaultErrors);

    if (typeof initValue !== 'undefined') {
      setValue(initValue);
    }

    if (typeof initErrors !== 'undefined') {
      setErrors(initErrors);
    }
  }, [node?.errors]);

  const updateValue = (change: ChangeEvent<HTMLInputElement>) => {
    setValue((currentValue) => {
      const { target: { checked: checkboxChecked, value: checkboxValue } } = change;

      let calculatedValue = { ...currentValue };

      if (node.options?.length > 0) {
        if (typeof calculatedValue !== 'object') {
          calculatedValue = {};
        }

        calculatedValue[checkboxValue] = checkboxChecked;
      } else {
        calculatedValue = checkboxChecked;
      }

      const nodeErrors = pageContext.validateNode(node, calculatedValue);
      pageContext.setValue(node.uuid, calculatedValue, nodeErrors);
      setErrors(nodeErrors);

      return calculatedValue;
    });
  };

  const valueChecked = (name: string) => {
    if (node.options?.length > 0) {
      return value[name] ?? false;
    }

    return !!value;
  };

  const { config } = node;

  const options = () => (node.options || [{ value: false, desc: node.name }]).map((option) => (
    <FormControlLabel
      key={`${node.name}-${String(option.value)}`}
      control={<Checkbox checked={valueChecked(option.value)} onChange={updateValue} name={option.desc} value={option.value} {...config?.checkbox} />}
      label={option.desc}
      {...config?.label}
    />
  ));

  return (
    <>
      <FormControl error={errors !== null} fullWidth>
        <FormGroup>
          {options()}
        </FormGroup>
        {errors !== null && (
        <FormHelperText id={`input-${node.uuid}-error`}>
          {Object.keys(errors).map((error) => (
            <span
              key={`${node.uuid}-${error}`}
            >
              {error}
            </span>
          ))}
        </FormHelperText>
        )}
      </FormControl>
    </>
  );
}
