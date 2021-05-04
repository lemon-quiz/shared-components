import { Slider } from '@material-ui/core';
import { useContext, useEffect, useState } from 'react';

import { NodeInterface } from '../../Interfaces/template.interface';
import { EditorContext, EditorContextInterface } from '../EditorContext';

interface SliderControlInterface {
  node: NodeInterface;
  path: number[];
  index: number;
  length: number;
}

function valuetext(value: number) {
  return `${value}°C`;
}

export default function SliderControl({
  node, path, index, length,
} : SliderControlInterface) {
  const editorContext = useContext<EditorContextInterface>(EditorContext);
  const [start, setStart] = useState(0);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const siblings = editorContext.getSiblings(path);
    setStart(siblings.length);
    setCounter(siblings.length);
  }, [index, length]);

  const handleChange = (event: any, newValue: number) => {
    if (newValue > counter) {
      const amountToAdd: number = newValue - counter;
      editorContext.addNode(path, undefined, amountToAdd);
      setCounter(newValue);
      return;
    }

    if (newValue < counter) {
      const amountToDelete: number = counter - newValue;
      editorContext.deleteNode(path, amountToDelete);
      setCounter(newValue);
    }
  };

  const setValue = (event: any, newValue: number) => {
    setStart(newValue);
  };

  const { config } = node;

  return (
    <Slider
      value={start}
      getAriaValueText={valuetext}
      aria-labelledby="discrete-slider"
      valueLabelDisplay="auto"
      step={1}
      marks
      min={0}
      max={100}
      onChangeCommitted={handleChange}
      onChange={setValue}
      {...config?.slider}
    />
  );
}
