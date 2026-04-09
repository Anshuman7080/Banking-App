// import axios from 'axios'
// import React from 'react'

// export const axiosInstance=axios.create();

// const apiClient = (method,url,bodyData,headers,params,withCredentials = false) => {
//   return axiosInstance({
//     method:`${method}`,
//     url:`${url}`,
//     data:bodyData?bodyData:null,
//     headers:headers?headers:{},
//     params:params?params:null,
//     withCredentials

//   })
// }

// export default apiClient

import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: "https://banking-backend-39g7.onrender.com/api/v1",
   withCredentials: true,
});

// ✅ REQUEST INTERCEPTOR
axiosInstance.interceptors.request.use((config) => {
  const token = JSON.parse(localStorage.getItem("token"))

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ✅ RESPONSE INTERCEPTOR
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log("coming in response interceptor",error);
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

const apiClient = (method, url, bodyData, params) => {
  return axiosInstance({
    method,
    url,
    data: bodyData || null,
    params: params || null,
    
  });
};

export default apiClient;
