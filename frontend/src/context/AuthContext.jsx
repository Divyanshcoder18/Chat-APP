import { createContext, useContext, useState } from "react";

export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
  let savedUser = null;

  try {
    savedUser = JSON.parse(localStorage.getItem("chatapp"));
  } catch (err) {
    savedUser = null;
  }

  const [authUser, setAuthUser] = useState(savedUser);

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};
