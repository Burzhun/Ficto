import {
  SET_CONTEXT_MENU,
  SET_CURRENT_ROW,
  SET_CURRENT_TABLE,
  SET_DESCRIPTION,
  SET_FETCH_ORG,
  SET_GRID_API,
  SET_ROW_DATA,
  SET_TABLE_LEGEND,
  SET_TABLE_OPTIONS,
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

const initialState = {
  titleProject: '',
  tabs: [],
  legend: '',
  type: '',
  descriptions: '',
  lastSave: new Date(),
  organization: '',
  rowData: [],
  gridApi: null,
  previousTableData: {},
  currentRow: null,
  serverSideOptions: {},
  currentProjectId: localStorage.getItem('currentProjectId')
    ? localStorage.getItem('currentProjectId')
    : null,
  periodical: false,
  template: {},
  tables: null,
  currentTable: null,
  plugin: null,
  colDef: {},
  contextMenu: {
    mouseX: null,
    mouseY: null,
  },
  responsibles: [],
};

export const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_FETCH_ORG:
      return { ...state, organization: action.payload };
    case SET_CONTEXT_MENU:
      return { ...state, contextMenu: action.payload };
    case SET_GRID_API:
      return { ...state, gridApi: action.payload };
    case SET_CURRENT_ROW:
      return { ...state, currentRow: action.payload };
    case SET_ROW_DATA:
      return { ...state, rowData: action.payload };
    case SET_TABLE_OPTIONS:
      return {
        ...state,
        serverSideOptions: action.payload.option,
        rowData: action.payload.data,
      };
    case SET_TABS:
      return { ...state, tabs: action.payload };
    case SET_DESCRIPTION:
      return { ...state, descriptions: action.payload };
    case SET_TITLE_PROJECT:
      return { ...state, titleProject: action.payload };
    case SET_TABLES:
      return { ...state, tables: action.payload };
    case SET_CURRENT_TABLE:
      return { ...state, currentTable: action.payload };
    case SET_TABLE_LEGEND:
      return { ...state, legend: action.payload };
    case SET_TABLE_TYPE:
      return { ...state, type: action.payload };
    case SET_MAIN_DATA: {
      return { ...state, mainData: action.payload };
    }
    case SET_CURRENT_PROJECT_ID: {
      return { ...state, currentProjectId: action.payload };
    }
    case SET_PERIODICAL: {
      return { ...state, periodical: action.payload };
    }
    case SET_TEMPLATE: {
      return { ...state, template: action.payload };
    }
    case SET_PLUGIN: {
      return { ...state, plugin: action.payload };
    }
    case SET_COL_DEF: {
      return { ...state, colDef: action.payload };
    }
    case SET_PREV_TABLE_DATA: {
      return { ...state, previousTableData: [...action.payload] };
    }
    case SET_SAVE_DATE: {
      return { ...state, lastSave: action.payload };
    }
    case SET_INIT_STATE: {
      return {...state, ...initialState}
    }
    case SET_RESPONIBLES: {
      return {...state,responsibles: action.payload}
    }
    default:
      return state;
  }
};
