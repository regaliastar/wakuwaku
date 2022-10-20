import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ReadyStateType {
  typingDone: boolean;
}

const ContentSlice = createSlice({
  name: 'content',
  initialState: {
    // redux 禁止直接修改 state
    readyState: {},
    stopTyping: false,
  },
  reducers: {
    setReadyState: (state, action: PayloadAction<ReadyStateType>) => {
      state.readyState = action.payload;
    },
    setStopTyping: (state, action: PayloadAction<boolean>) => {
      state.stopTyping = action.payload;
    },
  },
});

export const { setReadyState, setStopTyping } = ContentSlice.actions;
export default ContentSlice.reducer;
