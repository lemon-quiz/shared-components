import {
  Box,
  TableCell,
} from '@material-ui/core';
import React from 'react';

import Sortable from './Sortable';

interface HeaderInterface {
  column: string;
  label: string;
  prefix?: string;
  sortable?: boolean;
}

export default function Header({
  column,
  label,
  prefix,
  sortable,
}: HeaderInterface) {
  return (
    <TableCell>
      <Box display="flex">
        <Box p={1} flexGrow={1} alignSelf="flex-end">
          {label}
        </Box>
        {sortable && <Sortable column={column} prefix={prefix} />}
      </Box>
    </TableCell>
  );
}
