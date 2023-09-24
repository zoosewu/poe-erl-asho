import { createStore, combineReducers } from 'redux';
import { skillGemReducer, currencyReducer, currencyDetailReducer, skillQualityReducer } from './reducer';
const rootReducer = combineReducers({
  skillGem: skillGemReducer,
  currency: currencyReducer,
  currencyDetails: currencyDetailReducer,
  skillQuality: skillQualityReducer,
});
const store = createStore(rootReducer);

export default store;