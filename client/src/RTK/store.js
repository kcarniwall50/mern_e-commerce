import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";

import productSlice from "./slice/ProductSlice";
import userSlice from "./slice/userSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    product: productSlice,
  },

  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
});
