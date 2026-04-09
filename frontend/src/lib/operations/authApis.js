

import { setToken } from "../../slices/authSlice";
import apiClient from "../apiClient";
import { Navigate, useNavigate } from "react-router-dom";
import { removeToken } from "../../slices/authSlice";
 const BASE_URL=import.meta.env.VITE_BASE_URL
 
console.log("BASE_URL is",BASE_URL);
import toast from "react-hot-toast";




export default function signup(email, password,transaction_pin, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Creating account...");

    try {
      const response = await apiClient(
        "POST",
        "/user/auth/register/",
        { email, password ,transaction_pin}
      );

      if (response.status === 201) {
        toast.success("Account created successfully 🎉");
     
      }
         navigate("/login");

    } catch (error) {
      toast.error("Error occurred while creating account ❌");
      console.log("error while creating account",error);

    } finally {
      toast.dismiss(toastId);
    }
  };
}


export  function login(email,password,navigate){
    return async(dispatch)=>{
      const toastId=toast.loading("logging....")
        try{
           
           const response=await apiClient('POST',BASE_URL+"/user/auth/login/",{
            email,password
           })
            
            dispatch(setToken(response.data.access));
            console.log("response of login",response);
            toast.success("User LoggedIn Successfully");
            
            navigate("/");
        }

        catch(error){
            if(error.response){
              
              console.log("error while logging",error.response.data.error);
            }else{
            console.log("error in login",error);
            }
            toast.error(error.response.data.error || "Something went wrong")
        }finally{
          toast.dismiss(toastId);
        }
    }
}

export function logout(navigate){
  return async(dispatch)=>{
    const toastId=toast.loading("logging out....")
    try{
         const response=await apiClient('POST',BASE_URL+"/user/auth/logout/",null,null,null,true)

         dispatch(removeToken())

         console.log("response of logout is",response);

         toast.success("User logged out successfully");
         navigate("/login")


    }
    catch(error){
      if(error.response){

        console.log("error in logging out",error.response);
        toast.error(error.response.data.error || "something went wrong")
      }else{
        console.log("error in logging out is",error);
        toast.error("something went wrong")
      }

    }finally{
      toast.dismiss(toastId)
    }
  }

}