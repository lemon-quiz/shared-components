import {
  FormControl,
  FormHelperText,
  MenuItem, Select,
} from '@material-ui/core';
import React, {
  ChangeEvent, useContext, useEffect, useState,
} from 'react';

import { SelectBoxInterface } from '../../Interfaces/template.interface';
import { EditorContext, EditorContextInterface } from '../EditorContext';

export default function SelectNode({ node }: { node: SelectBoxInterface }) {
  const pageContext = useContext<EditorContextInterface>(EditorContext);
  const [value, setValue] = useState<any>('');
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
    const { target: { value: newValue } } = change;
    const nodeErrors = pageContext.validateNode(node, newValue);
    pageContext.setValue(node.uuid, newValue, nodeErrors);
    setValue(newValue);
    setErrors(nodeErrors);
  };

  const { config } = node;

  return (
    <>
      <FormControl error={errors !== null} fullWidth>
        <Select value={value} onChange={updateValue} {...node?.select}>
          {node?.options?.map(({ value: optionValue, desc }) => <MenuItem key={optionValue} value={optionValue} {...config?.option}>{desc}</MenuItem>)}
        </Select>
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
