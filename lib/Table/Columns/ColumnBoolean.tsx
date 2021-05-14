import { TableCell } from '@material-ui/core';
import { Done } from '@material-ui/icons';
import React from 'react';

import { ColumnInterface } from '../TableInterface';

export default function ColumnBoolean({
  align,
  record,
  column,
}: ColumnInterface) {
  return (
    <TableCell align={align}>{record[column] ? <Done /> : null}</TableCell>
  );
}
