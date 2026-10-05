import {createSlice} from "@reduxjs/toolkit";
import type {UserState} from "./userTypes.ts";

const initialState: UserState = {
    _id: null,
    name: null,
    email: null,
    phone: null,
    isAuthenticated: false,
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state._id = action.payload._id;
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.phone = action.payload.phone;
            state.isAuthenticated = true;
        },
        clearUser: (state) => {
            state._id = null;
            state.name = null;
            state.email = null;
            state.isAuthenticated = false;
        }
    }
})

export const {setUser, clearUser} = userSlice.actions;

export default userSlice.reducer;