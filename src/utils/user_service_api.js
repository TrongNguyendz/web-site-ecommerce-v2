import axios from "axios"; 

// đăng nhập
export const Login = async(data) => {
    return await axios.post('http://localhost:3000/api/v1/users/login' , data) ;
}
// đăng kí
export const Register = async(data) => {
    return await axios.post('http://localhost:3000/api/v1/users/register' , data) ;
}
// cập nhật hồ sơ người dùng
export const UpdateProfile = async (id, data, token) => {
    if (!token) throw new Error('Token is required');

    return await axios.put(
        `http://localhost:3000/api/v1/users/${id}`,
        data,
        {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }
    );
};

export const getlistuser = async (token) => {
    if (!token) throw new Error('Token is required');   
    return await axios.get(
        `http://localhost:3000/api/v1/users`,
        {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }
    );
}

export const updateUserRole = async (id, data, token) => {
    if (!token) throw new Error('Token is required');
    return await axios.put(
        `http://localhost:3000/api/v1/users/${id}/role`,
        data,
        {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }
    );
};

export const deleteUser = async (id, token) => {
    if (!token) throw new Error('Token is required');
    return await axios.delete(
        `http://localhost:3000/api/v1/users/${id}`,
        {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }
    );
};