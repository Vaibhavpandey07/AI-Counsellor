import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials : true,
})

api.interceptors.response.use(response=>response , async(err) =>{

    const originalRequest = err.config;

    if(err.response?.status == 401 && !originalRequest._retry ){

        originalRequest._retry = true;

        try{
            await api.post("/api/v1/users/getAccessToken").then(res=>{
                localStorage.setItem("isLogIn", true);
            });

            return api(originalRequest);
        }catch(refreshError){
            window.location.href = "/login"
            return Promise.reject(refreshError);
        }
    }
    

    return Promise.reject(err);
})


export default api;