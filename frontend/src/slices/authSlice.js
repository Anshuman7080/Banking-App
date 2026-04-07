import { createSlice } from "@reduxjs/toolkit";

const initialState={
    signupData:null,
     token: localStorage.getItem("token")
    ? JSON.parse(localStorage.getItem("token"))
    : null,
    loading:false
}

const authSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{
        setSignupData:(state,action)=>{
            state.singupData=action.payload
        },
        setLoading:(state,action)=>{
            state.loading=action.payload
        },
        setToken:(state,action)=>{
            localStorage.setItem("token",JSON.stringify(action.payload));
            state.token=action.payload
        },
        removeToken:(state,action)=>{
            localStorage.removeItem("token")
            state.signupData=null
            state.token=null
        }
    }
})


export const {setSignupData,setLoading,setToken,removeToken}=authSlice.actions

export default authSlice.reducer