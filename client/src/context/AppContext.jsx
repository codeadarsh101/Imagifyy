import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import {useNavigate} from 'react-router-dom'

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [credit, setCredit] = useState(0);

  const navigate=useNavigate()

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const loadCreditsData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/credits", {
        headers: {
          token, // from localstorage-->header
        },
      });

      if (data.success) {
        setCredit(data.credits); //set the value of credit..
        setUser(data.user);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      loadCreditsData();
    }
  }, [token]);

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
  };

  const generateImage = async (prompt) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/image/generate-image",
        { prompt },
        { headers: { token } }
      );

      if (data.success) {
        loadCreditsData();
        return data.resultImage;

      } else {
        toast.error(data.message);
         loadCreditsData();
      if(data.creditBalance===0){
         navigate('/buy');
      }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const value = {
    user,
    setUser,
    showLogin,
    setShowLogin,
    token,
    setToken,
    credit,
    setCredit,
    loadCreditsData,
    generateImage,
    logout,
    backendUrl,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
export default AppContextProvider;
