import { axiosInstance } from ".";

export const createIpoApi = async(payload) => {
    try{
        const response = await axiosInstance.post('/ipo',payload);
        return response.data;
    }catch(e){
        return e;
    }
}
export const updateIpoApi = async(payload) => {
    try{
        const response = await axiosInstance.patch('/ipo',payload);
        return response.data;
    }catch(e){
        return e;
    }
}
export const getAllIpoApi = async(payload) => {
    try{
        const response = await axiosInstance.get(`/ipo?condition=${payload.type}`);
        return response.data;
    }catch(e){
        return e;
    }
}
export const getIpoApi = async() => {
    try{
        const response = await axiosInstance.get('/ipo/:id');
        return response.data;
    }catch(e){
        return e;
    }
}
export const deleteIpoApi = async({id}) => {
    try{
        const response = await axiosInstance.delete(`/ipo/${id}`);
        return response.data;
    }catch(e){
        return e;
    }
}