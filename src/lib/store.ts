import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import sessionReducer from "@/slices/sessionSlice";
import { authApi } from "@/services/authApi";
import { contentApi } from "@/services/contentApi";

export const store = configureStore({
  reducer: {
    session: sessionReducer,
    [authApi.reducerPath]: authApi.reducer,
    [contentApi.reducerPath]: contentApi.reducer,
  },
  middleware: (gDM) => gDM().concat(authApi.middleware, contentApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
