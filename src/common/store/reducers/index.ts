import { combineReducers } from '@reduxjs/toolkit';
import contentSlice from './content';
import scriptSlice from './script';

const rootReducers = combineReducers({
  content: contentSlice,
  script: scriptSlice,
});

export default rootReducers;
