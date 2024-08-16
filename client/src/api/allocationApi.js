import { axiosInstance } from ".";

export const createAllocationApi = async(payload) => {
    try{
        const response = await axiosInstance.post('/allocation',payload);
        return response.data;
    }catch(e){
        return e;
    }
}
export const listOfIposOfUserApi = async() => {
    try{
        const response = await axiosInstance.get('/allocation/listOfIposOfUser');
        return response.data;
    }catch(e){
        return e;
    }
}