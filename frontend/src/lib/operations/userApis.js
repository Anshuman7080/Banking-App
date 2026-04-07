import apiClient from "../apiClient";
 const BASE_URL=import.meta.env.VITE_BASE_URL
console.log("BASE_URL is",BASE_URL);


export function UserProfile(token){
    return async(dispatch)=>{
        try{
            const response=await apiClient("GET",'/user/profile',null,null,null,true  )
         console.log("user profile  is ",response);
        }
        catch(error){
         console.log("error in getting user profile",error);

        }
    }
}


export const  UploadImageFile=async(formData)=>{
    try{
          const response=await apiClient("POST",BASE_URL+'/user/upload/',
           formData,null,null,true)
         return response?.data;
    }
    catch(error){
        console.log("error in uploading file ",error);
    }
}


export const  UploadKycDetail=async(full_name,date_of_birth,id_type,id_image,token)=>{

    try{

         const res=await apiClient("POST",BASE_URL+'/user/kyc/',
           {
            full_name,date_of_birth,id_type,id_image
           },{
            Authorization:`Bearer ${token}`
           },null,true)

           console.log("response of create kyc is",res);
        
    }
    catch(error){
         if (error.response) {
    console.error("KYC error:", error.response.data);
    alert(error.response.data?.[0] || "Something went wrong");
  } else {
    console.error(" error in uploading kyc details", error.message);
  }
    }

}