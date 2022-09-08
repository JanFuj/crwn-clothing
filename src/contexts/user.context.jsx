import { createContext, useEffect, useReducer } from "react";
import {
  createUserDocumentFromAuth,
  onAutStateChangedListener,
} from "../utils/firebase/firebase.utils";
import { createAction } from "../utils/reducer/reducer.util";

// as the actual value you want to access
export const UserContext = createContext({
  currentUser: null,
  setCurrentUser: () => null,
});
export const USER_ACTION_TYPES = {
  SET_CURRENT_USER: "SET_CURRENT_USER",
};

const userReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case USER_ACTION_TYPES.SET_CURRENT_USER:
      return {
        ...state,
        currentUser: payload,
      };
    default:
      throw new Error(`Unhandled type ${type} in user reducer`);
  }
};

const INITIAL_STATE = {
  currentUser: null,
};
// this is the actual component
export const UserProvider = ({ children }) => {
  //actual state, every child can access
  //const [currentUser, setCurrentUser] = useState(null);
  const [state, dispatch] = useReducer(userReducer, INITIAL_STATE);
  const { currentUser } = state;
  console.log(currentUser);
  const setCurrentUser = (user) => {
    dispatch(createAction(USER_ACTION_TYPES.SET_CURRENT_USER, user));
  };
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
