import { combineReducers } from "@reduxjs/toolkit";
import postReducer from "./postSlice";
import userReducer from "./userSlice";
import profileReducer from "./profileSlice";

const rootReducer = combineReducers({
  post: postReducer,
  user: userReducer,
  profile: profileReducer,
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = ReturnType<
  typeof import("../components/configureStore").default
>["dispatch"];
