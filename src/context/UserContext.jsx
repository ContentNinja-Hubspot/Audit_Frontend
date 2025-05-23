import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { fetchUserData, checkUserType } from "../api";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [token, setToken] = useState(Cookies.get("state") || null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    Cookies.remove("state");
    setUser(null);
    setToken(null);
  };

  useEffect(() => {
    if (token) {
      fetchUserData(token)
        .then(setUser)
        .catch(() => setUser(null))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      checkUserType(token).then((res) => {
        setUserType(res.user_type); 
      });
    }
  }, [token]);

  return (
    <UserContext.Provider
      value={{ user, userType, token, setToken, logout, loading }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
