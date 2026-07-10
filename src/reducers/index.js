import { combineReducers } from "redux";
import CurrencyReducer from "./currency";
import UriReducer from './uri';
import UserReducer from './user'

const appReducer = combineReducers({ CurrencyReducer, UriReducer, UserReducer })
export default appReducer