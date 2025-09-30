import { combineReducers } from "redux";
import post from "./postReducer";
import user from "./userReducer";
import profile from "./profileReducer";
import { RootState } from "../types";

const root = combineReducers({
  post,
  profile,
  user,
});

export default root;
