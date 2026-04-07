import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "../slices/authSlice"
import userReducer from "../slices/userSlice"
import themeReducer from "../slices/themeSlice"
import overviewReducer from "../slices/overviewSlice"


const reducer=combineReducers({
    auth:authReducer,
    user:userReducer,
    theme:themeReducer,
    overview:overviewReducer
})

export default reducer