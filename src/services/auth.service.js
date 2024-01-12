import axios from "axios";

const API_URL = "https://opmdata.gem.spc.int/shoreline/api/auth/";
  
const login = (username, password) => {
return axios
    .post(API_URL + "signin", {
    username,
    password,
    })
    .then((response) => {
        console.log(response)
    if (response.data.username) {
        localStorage.setItem("user", JSON.stringify(response.data));
    }

    return response.data;
    });
};

const logout = () => {
localStorage.removeItem("user");
};

const getCurrentUser = () => {
return JSON.parse(localStorage.getItem("user"));
};

const AuthService = {
login,
logout,
getCurrentUser,
}

export default AuthService;