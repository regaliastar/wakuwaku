import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '..';
import { SecenEvent } from '~interface/parser';

const ScriptSlice = createSlice({
  name: 'script',
  initialState: {
    secenEvents: <SecenEvent[][]>[],
    currentSecenIndex: 0,
  },
  reducers: {
    setSecenEvents: (state, action: PayloadAction<SecenEvent[][]>) => {
      state.secenEvents = action.payload;
    },
    addCurrentSecenIndex: state => {
      state.currentSecenIndex += 1;
    },
  },
});

export const { setSecenEvents, addCurrentSecenIndex } = ScriptSlice.actions;

export const execNextEvent = async () => (dispatch: AppDispatch) => {
  dispatch(addCurrentSecenIndex());
};

export default ScriptSlice.reducer;
