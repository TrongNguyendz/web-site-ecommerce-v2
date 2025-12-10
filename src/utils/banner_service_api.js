import axios from "axios"; 

export const getListBanners = async (token) => {
    return await axios.get('http://localhost:3000/api/v1/banners');
}