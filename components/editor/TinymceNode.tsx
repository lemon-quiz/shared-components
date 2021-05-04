import { FormControl, FormHelperText } from '@material-ui/core';
import { Editor } from '@tinymce/tinymce-react';
import React, {
  useContext, useEffect, useState,
} from 'react';

import { EditorContext, EditorContextInterface } from '../../lib';
import { CustomNodeInterface } from '../../lib/Interfaces/template.interface';

interface TinymceNodeInterface {
  node: CustomNodeInterface;
}

export default function TinymceNode({ node }: TinymceNodeInterface) {
  const pageContext = useContext<EditorContextInterface>(EditorContext);
  const [value, setValue] = useState<any>('');
  const [errors, setErrors] = useState<any>(null);

  useEffect(() => {
    const {
      uuid,
      value: defaultValue,
      errors: defaultErrors,
    } = node;

    const {
      value: initValue,
      errors: initErrors,
    } = pageContext.getValue(uuid, defaultValue, defaultErrors);

    if (typeof initValue !== 'undefined') {
      setValue(initValue);
    }

    if (typeof initErrors !== 'undefined') {
      setErrors(initErrors);
    }
  }, [node?.errors]);

  const updateValue = (newValue: string) => {
    const nodeErrors = pageContext.validateNode(node, newValue);
    pageContext.setValue(node.uuid, newValue, nodeErrors);
    setValue(newValue);
    setErrors(nodeErrors);
  };

  const { config } = node;

  return (
    <FormControl error={errors !== null} fullWidth>
      <Editor
        value={value}
        onEditorChange={updateValue}
        init={{
          height: 500,
          menubar: false,
          plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount',
          ],
          toolbar: 'undo redo | formatselect | '
            + 'bold italic backcolor | alignleft aligncenter '
            + 'alignright alignjustify | bullist numlist outdent indent | '
            + 'removeformat | help',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
          ...config?.editor,
        }}
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
  );
}
