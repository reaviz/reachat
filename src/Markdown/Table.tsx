import React, { FC, PropsWithChildren } from 'react';

export const TableComponent: FC<PropsWithChildren<React.HTMLAttributes<HTMLTableElement>>> = ({ children, ...props }) => (
  <table {...props}>
    {children}
  </table>
);

export const TableHeaderCell: FC<PropsWithChildren<React.HTMLAttributes<HTMLTableHeaderCellElement>>> = ({ children, ...props }) => (
  <th {...props}>
    {children}
  </th>
);

export const TableDataCell: FC<PropsWithChildren<React.HTMLAttributes<HTMLTableDataCellElement>>> = ({ children, ...props }) => (
  <td {...props}>
    {children}
  </td>
);
