import { axiosInstance } from ".";

export const SignupApi = async(payload) => {
    try{
        const response = await axiosInstance.post('/user/signup',payload);
        return response.data;
    }catch(e){
        return e;
    }
}
export const LoginApi = async(payload) => {
    try{
        const response = await axiosInstance.post('/user/login',payload);
        return response.data;
    }catch(e){
        return e;
    }
}