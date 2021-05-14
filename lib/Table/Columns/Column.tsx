import { TableCell } from '@material-ui/core';
import React from 'react';

import getValue from '../../utils/getValue';
import { ColumnInterface } from '../TableInterface';

export default function Column({
  align,
  record,
  column,
  children,
}: ColumnInterface) {
  if (children) {
    return <TableCell align={align}>{children(getValue(record, column), record)}</TableCell>;
  }

  return (
    <TableCell align={align}>{getValue(record, column)}</TableCell>
  );
}
