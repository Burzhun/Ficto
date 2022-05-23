import React, { useState } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { Select, SelectReportBox } from '../../../styles/ServiceStyle';
import { useSelector } from 'react-redux';
import FolderIcon from '@material-ui/icons/Folder';

export const SelectReport = () => {
  const reportsList = useSelector((state) => state.serviceState.reportsList);
  const [current, setCurrent] = useState(reportsList[0].id);

  const handleChange = (event) => {
    setCurrent(event.target.value);
  };

  return (
    <SelectReportBox>
      <FolderIcon />
      <Select value={current} onChange={handleChange} displayEmpty>
        {reportsList.map((node) => (
          <MenuItem key={node.id} value={node.id}>
            {node.title}
          </MenuItem>
        ))}
      </Select>
    </SelectReportBox>
  );
};
