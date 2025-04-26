import { createContext, useState } from "react";

export const AuthContext = createContext(null);

const AuthProvider = (props) =>{
  const [isLoggedIn,setIsLoggedIn] = useState(false);
  const [authUser,setAuthUser] = useState({});

  const contextValue = {
    isLoggedIn,
    setIsLoggedIn,
    authUser,
    setAuthUser
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;