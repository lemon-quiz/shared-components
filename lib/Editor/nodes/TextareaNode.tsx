import {
  FormControl,
  FormHelperText, Input, InputLabel,
} from '@material-ui/core';
import React, {
  ChangeEvent, useContext, useEffect, useState,
} from 'react';

import { TextareaInterface } from '../../Interfaces/template.interface';
import { EditorContext, EditorContextInterface } from '../EditorContext';

export default function TextareaNode({ node }: { node: TextareaInterface }) {
  const pageContext = useContext<EditorContextInterface>(EditorContext);
  const [value, setValue] = useState<any>('');
  const [errors, setErrors] = useState<any>(null);

  useEffect(() => {
    const {
      value: defaultValue,
    } = node;

    if (typeof defaultValue !== 'undefined') {
      setValue(defaultValue);
    }
  }, [node.uuid]);

  useEffect(() => {
    const { errors: defaultErrors } = node;

    if (defaultErrors) {
      setErrors(defaultErrors);
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
        <InputLabel htmlFor={`input-${node.uuid}`}>{node.label}</InputLabel>
        <Input
          value={value}
          onChange={updateValue}
          aria-describedby={`input-${node.uuid}-error`}
          multiline
          rows={20}
          {...config?.input}
        />
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
