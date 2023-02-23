import axios from "axios";
const URL = "http://localhost:8000/api";
export const register = async (name, email, password, userType) => {
  try {
    console.log("hi");
    return await axios.post(`${URL}/register`, {
      name,
      email,
      password,
      userType,
    });
  } catch (err) {
    console.log(err);
  }
};

export const login = async (email, password) => {
  try {
    return await axios.post(`${URL}/login`, {
      email,
      password,
    });
  } catch (err) {
    console.log(err);
  }
};
