import apiClient from "../apiClient";
import toast from "react-hot-toast";
 const BASE_URL=import.meta.env.VITE_BASE_URL
console.log("BASE_URL is",BASE_URL);

 export const verifyWalletFunding=async({paymentId,amount,token})=>{
    try{


        const res=await apiClient("POST",BASE_URL+'/core/verify/',
           {
            paymentId,amount
           },{
            Authorization:`Bearer ${token}`
           },null,true)
           console.log("response of verifying wallet funding is",res);
           return res

    }
    catch(error){
         if (error.response) {
    console.error("funding wallet error:", error.response.data.error);
    alert(error.response.data.error || "Something went wrong");
  } else {
    console.error(" error in funding  wallet", error.message);
  }
    }
}


export const addBeneficiary=async(beneficaryDetail,token)=>{
try{

  console.log("beneficaryDetail in addBeneficiary",beneficaryDetail)
  const res=await apiClient("POST",BASE_URL+'/core/beneficiaries/add/',
           {
            beneficaryDetail
           },{
            Authorization:`Bearer ${token}`
           },null,true)

           console.log("response of adding beneficary ----",res)
          return res;

}
catch(error){
  if(error.response){
  console.error("beneficary adding error:", error.response.data.error);
  }else{
  
    console.log("error in adding beneficary",error);
  }
}
}


export const getBeneficiaries=async(token)=>{
try{
    console.log("coming in getBeneficiaries")
           const res=await apiClient("GET",BASE_URL+'/core/beneficiaries/',
           {
           },{
            Authorization:`Bearer ${token}`
           },null,true)
          

           console.log("response of getting beneficaries ----",res.data)
          return res;

}
catch(error){
  if(error.response){
     console.error("getting beneficiaries error:", error.response.data.error);

  }else{
    console.log("error in getting beneficiaries",error);

  }
}
}


export const deleteBeneficiary=async(token,id)=>{
try{
  
  const res=await apiClient("DELETE",BASE_URL+`/core/beneficiaries/${id}/`,
           {
           },{
            Authorization:`Bearer ${token}`
           },null,true)
          

           console.log("response of deleting beneficaries ----",res.data)
          return res;


}
catch(error){
  if(error.response){
    console.log("deleteBeneficary error",error.response.data.error);
  }
 else{
  console.log("error in delete Beneficiary",error);
  }
  
}

}


export const verifyWalletId=async(token,wallet_id)=>{
try{

  console.log("wallet id in verifywalledId",wallet_id)

       const res=await apiClient("GET",BASE_URL+`/core/wallet/${wallet_id}/`,
           {
           },{
            Authorization:`Bearer ${token}`
           },null,true)
           console.log("res of verify wallet id is",res);
           return res;

}
catch(error){
  if(error.response){
    console.log("Error in verifying wallet",error.response.data.error);
  }else{
    console.log("error in verifying wallet",error);
  }
}
}

export const transferFunds=async(token,wallet_id,pin,raw_amount)=>{
  try{ 
    console.log("wallet id ",wallet_id)
      const res=await apiClient("POST",BASE_URL+`/core/transfer/`,
           {
            wallet_id,
            transaction_pin:pin,
            raw_amount
           },{
            Authorization:`Bearer ${token}`
           },null,true)
           console.log("res of transfer funds",res);
           return res;

  }
  catch(error){
    if(error.response){
      console.log("error in transferfunds",error.response)
      return error.response;
        }else{
      console.log("error in trasfer funds",error);
    }
  }
}




export const transactionLists = async (token, page = 1) => {
  try {
    const res = await apiClient(
      "GET",
      BASE_URL + `/core/transactions/?page=${page}`,
      {},
      {
        Authorization: `Bearer ${token}`,
      },
      null,
      true
    );

    return res;
  } catch (error) {
    if (error.response) {
      console.log("Error in getting transaction list", error.response);
    } else {
      console.log("error in getting transactions list", error);
    }
  }
};

export const transactionDetail=async(token,reference)=>{
  try{

      const res=await apiClient("GET",BASE_URL+`/core/transactions/${reference}/`,
           {
           
           },{
            Authorization:`Bearer ${token}`
           },null,true)
           console.log("res of transactionDetail",res);
           return res;

  }
  catch(error){
    if(error.response){
      console.log("error in getting transactionDetails",error.response);
    }else{
      console.log("error in getting transactionDetails",error);
    }
  }
}




export const createSavingGoal=async({name,target_amount,target_date,token})=>{
  try{
        
        const res=await apiClient("POST",BASE_URL+`/core/savings-goals/create/`,
           {
            name,target_amount,target_date
           },{
            Authorization:`Bearer ${token}`
           },null,true)
           console.log("res of createSavingGoal",res);
           return res;

  }
  catch(error){
    if(error.response){
      console.log("error in creating saving goals",error.response);
    }else{
      console.log("error in creating saving goals",error);
    }
  }
}


// api.js
export const savingGoalList = async (token) => {
  try {
    const res = await apiClient("GET", BASE_URL + `/core/savings-goals/`, {}, {
      Authorization: `Bearer ${token}`
    }, null, true);
    console.log("res of savingGoalList", res);
    return res;
  } catch (error) {
    if (error.response) {
      console.log("error in getting saving goals", error.response);
    } else {
      console.log("error in getting saving goals", error);
    }
  }
};


export const savingGoalDetail=async(token,uuid)=>{
   try{
        
        const res=await apiClient("GET",BASE_URL+`/core/savings-goals/${uuid}`,
           {
           },{
            Authorization:`Bearer ${token}`
           },null,true)
           console.log("res of savingGoalDetail",res);
           return res;

  }
  catch(error){
    if(error.response){
      console.log("error in getting saving goal details",error.response);
    }else{
      console.log("error in getting saving goal details",error);
    }
  }
}


export const depostieToSavingGoal=async(token,uuid,amount,transaction_pin)=>{
   try{
        
        const res=await apiClient("POST",BASE_URL+`/core/savings-goals/deposit/`,
           {
            uuid,amount
           },{
            Authorization:`Bearer ${token}`
           },null,true)
           console.log("res of depostiToSavingGoal",res);
           return res;

  }
  catch(error){
    if(error.response){
      console.log("error in depositing to saving goal ",error.response);
    }else{
      console.log("error in depositing to saving goal",error);
    }
  }
}

export const withdrawFromSavingGoal=async(token,uuid)=>{
    try{
        
        const res=await apiClient("POST",BASE_URL+`/core/savings-goals/withdraw/`,
           {
            uuid
           },{
            Authorization:`Bearer ${token}`
           },null,true)
           console.log("res of withdrawFromSavingGoal",res);
           return res;

  }
  catch(error){
    if(error.response){
      console.log("error in withdrawing from saving goal ",error.response);
    }else{
      console.log("error in withdrawing from saving goal",error);
    }
  }
}


export const getNotificationList=async(token)=>{
   try{
        
        const res=await apiClient("GET",BASE_URL+`/core/notifications/`,
           {
            
           },{
            Authorization:`Bearer ${token}`
           },null,true)
           console.log("res of getNotificationList",res);
           return res;

  }
  catch(error){
    if(error.response){
      console.log("error in getting  notifications list ",error.response);
    }else{
      console.log("error in getting  notifications list ",error);
    }
  }
}




export const markNotificationAsRead=async(token,id)=>{
   try{
        
        const res=await apiClient("POST",BASE_URL+`/core/notifications/${id}/read/`,
           {
           },{
            Authorization:`Bearer ${token}`
           },null,true)
           console.log("res of markNotificationAsRead",res);
           return res;

  }
  catch(error){
    if(error.response){
      console.log("error in markNotificationAsRead ",error.response);
    }else{
      console.log("error in markNotificationAsRead ",error);
    }
  }
}


export const markAllNotificationAsRead=async(token)=>{
   try{
        
        const res=await apiClient("POST",BASE_URL+`/core/notifications/read-all/`,
           {
           },{
            Authorization:`Bearer ${token}`
           },null,true)
           console.log("res of markAllNotificationAsRead",res);
           return res;

  }
  catch(error){
    if(error.response){
      console.log("error in markAllNotificationAsRead ",error.response);
    }else{
      console.log("error in markAllNotificationAsRead ",error);
    }
  }
}



export const getOverview=async(token)=>{

   try{
    
        
        const res=await apiClient("GET",BASE_URL+`/core/overview/`,
           {
           },{
            Authorization:`Bearer ${token}`
           },null,true)
           console.log("res of getOverview",res);
           return res;

  }
  catch(error){
    if(error.response){
      console.log("error in getOverview ",error.response);
    }else{
      console.log("error in getOverview ",error);
    }
  }
}