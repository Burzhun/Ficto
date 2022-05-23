import {
  SET_CONTEXT_MENU,
  SET_CURRENT_ROW,
  SET_CURRENT_TABLE,
  SET_DESCRIPTION,
  SET_FETCH_ORG,
  SET_GRID_API,
  SET_ROW_DATA,
  SET_TABLE_LEGEND,
  // SET_TABLE_OPTIONS,
  SET_TABLE_TYPE,
  SET_TABLES,
  SET_TABS,
  SET_TITLE_PROJECT,
  SET_MAIN_DATA,
  SET_CURRENT_PROJECT_ID,
  SET_PERIODICAL,
  SET_TEMPLATE,
  SET_PLUGIN,
  SET_COL_DEF,
  SET_PREV_TABLE_DATA,
  SET_SAVE_DATE, SET_INIT_STATE, SET_RESPONIBLES,
} from '../types/data.types';

export const setOrganization = (value) => {
  return {
    type: SET_FETCH_ORG,
    payload: value,
  };
};

export const setContextMenu = (value = { mouseX: null, mouseY: null }) => {
  return {
    type: SET_CONTEXT_MENU,
    payload: value,
  };
};

export const setColDef = (obj) => {
  return {
    type: SET_COL_DEF,
    payload: obj,
  };
};

export const setPrevTableData = (array) => {
  return {
    type: SET_PREV_TABLE_DATA,
    payload: array,
  };
};

export const setLastSaveDate = (date) => {
  console.log(date);
  return {
    type: SET_SAVE_DATE,
    payload: date,
  };
};

export const setGridApi = (ref) => {
  return {
    type: SET_GRID_API,
    payload: ref,
  };
};

export const setCurrentRow = (value) => {
  return {
    type: SET_CURRENT_ROW,
    payload: value,
  };
};

export const setRowData = (data) => {
  return {
    type: SET_ROW_DATA,
    payload: data,
  };
};

export const setTableLegend = (html) => {
  return {
    type: SET_TABLE_LEGEND,
    payload: html,
  };
};

export const setDescriptionProject = (html) => {
  return {
    type: SET_DESCRIPTION,
    payload: html,
  };
};

export const setTabs = (array) => {
  return {
    type: SET_TABS,
    payload: array,
  };
};

export const setTitleProject = (value) => {
  return {
    type: SET_TITLE_PROJECT,
    payload: value,
  };
};

export const setPeriodical = (bool) => {
  return {
    type: SET_PERIODICAL,
    payload: bool,
  };
};

export const setTemplate = (obj) => {
  return {
    type: SET_TEMPLATE,
    payload: obj,
  };
};

export const setPlugin = (string) => {
  return {
    type: SET_PLUGIN,
    payload: string,
  };
};

export const setTables = (data) => {
  return {
    type: SET_TABLES,
    payload: data,
  };
};
//
// export const setTableOptions = (option, data) => {
//   return {
//     type: SET_TABLE_OPTIONS,
//     payload: {
//       data,
//       option,
//     },
//   };
// };

export const setTableType = (value) => {
  return {
    type: SET_TABLE_TYPE,
    payload: value,
  };
};

export const setInitState = () => {
  return {
    type: SET_INIT_STATE,
  }
}

export const setCurrentTable = (id) => {
  return {
    type: SET_CURRENT_TABLE,
    payload: id,
  };
};

export const setMainData = (data) => {
  return {
    type: SET_MAIN_DATA,
    payload: data,
  };
};

export const setCurrentProjectId = (id) => {
  return {
    type: SET_CURRENT_PROJECT_ID,
    payload: id,
  };
};
export const setResponsibles = (data) => {
  return {
    type: SET_RESPONIBLES,
    payload: data
  }
}
