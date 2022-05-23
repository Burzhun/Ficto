import { combineReducers } from 'redux';
import { authReducer } from './reducers/auth.reducer';
import { dataReducer } from './reducers/data.reducer';
import { serviceState } from './reducers/service.reducer';
import { workPlaces } from './reducers/workPlace.reducer';
import { mainDataReducer } from './reducers/mainData.reducer';
import { surveyReducer } from './reducers/survey.reducer';
// cspell:disable-next-line
import { handsontableReducer } from './reducers/handontable.reducer';
import { filterReducer } from '../Components/ServiceComponents/FilterComponents/redux/filter.reducer';

export const rootReducer = combineReducers({
  auth: authReducer,
  mainData: mainDataReducer,
  data: dataReducer,
  workPlaces: workPlaces,
  serviceState,
  survey: surveyReducer,
  handsontable: handsontableReducer,
  filters: filterReducer,
});
