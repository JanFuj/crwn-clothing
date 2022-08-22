import { async } from "@firebase/util";
import { useState, createContext, useEffect } from "react";
import {
  createUserDocumentFromAuth,
  onAutStateChangedListener,
} from "../utils/firebase/firebase.utils";

// as the actual value you want to access
export const UserContext = createContext({
  currentUser: null,
  setCurrentUser: () => null,
});

// this is the actual component
export const UserProvider = ({ children }) => {
  //actual state, every child can access
  const [currentUser, setCurrentUser] = useState(null);
  const value = { currentUser, setCurrentUser };

  const handleAuthStateChanged = async (user) => {
    console.log("handleAuthStateChanged", user);
    if (user) {
      createUserDocumentFromAuth(user);
    }
    setCurrentUser(user);
  };

  useEffect(() => {
    const usnsubscribe = onAutStateChangedListener(handleAuthStateChanged);

    return usnsubscribe; //calling unsubscribe when unmouting
  }, []);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
