import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { fetchUserData, checkUserType, fetchUserCredits } from "../api";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [token, setToken] = useState(Cookies.get("state") || null);
  const [userCredits, setUserCredits] = useState({
    total: null,
    remaining: null,
    used: null,
  });
  const [loading, setLoading] = useState(true);

  const logout = () => {
    Cookies.remove("state");
    setUser(null);
    setToken(null);
    setUserCredits({ total: null, remaining: null, used: null });
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

  useEffect(() => {
    if (token) {
      fetchUserCredits(token)
        .then((data) => {
          setUserCredits({
            total: data.total_credits,
            remaining: data.credits_remaining,
            used: data.credits_used,
          });
        })
        .catch((error) => {
          console.error("Failed to fetch user credits:", error);
          setUserCredits({ total: null, remaining: null, used: null });
        });
    }
  }, [token]);

  return (
    <UserContext.Provider
      value={{
        user,
        userType,
        token,
        setToken,
        logout,
        loading,
        userCredits,
        setUserCredits,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
