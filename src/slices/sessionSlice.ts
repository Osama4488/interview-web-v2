import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type SessionState = {
  pendingEmail?: string;
};

const initialState: SessionState = {};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setPendingEmail(state, action: PayloadAction<string | undefined>) {
      state.pendingEmail = action.payload;
    },
  },
});

export const { setPendingEmail } = sessionSlice.actions;
export default sessionSlice.reducer;
