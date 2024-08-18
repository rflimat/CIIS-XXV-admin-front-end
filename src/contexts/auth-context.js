import { createContext, useContext, useEffect, useReducer, useRef } from "react";
import PropTypes from "prop-types";
import URI from "./url-context";

const HANDLERS = {
  INITIALIZE: "INITIALIZE",
  SIGN_IN: "SIGN_IN",
  SIGN_OUT: "SIGN_OUT",
};

const expirationTime = new Date();
expirationTime.setMinutes(expirationTime.getMinutes() + 120);

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  expirationTime,
};

const handlers = {
  [HANDLERS.INITIALIZE]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      ...// if payload (user) is provided, then is authenticated
      (user
        ? {
            isAuthenticated: true,
            isLoading: false,
            user,
          }
        : {
            isLoading: false,
          }),
    };
  },
  [HANDLERS.SIGN_IN]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  [HANDLERS.SIGN_OUT]: (state) => {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    };
  },
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

// The role of this context is to propagate authentication state through the App tree.

export const AuthContext = createContext({ undefined });

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const initialized = useRef(false);

  const initialize = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    let isAuthenticated = false;

    try {
      isAuthenticated = window.sessionStorage.getItem("authenticated") === "true";
    } catch (err) {
      console.error(err);
    }

    if (isAuthenticated) {
      const user = JSON.parse(window.sessionStorage.getItem("ciisTacnaAdmin"));

      dispatch({
        type: HANDLERS.INITIALIZE,
        payload: user,
        expirationTime,
      });
    } else {
      dispatch({
        type: HANDLERS.INITIALIZE,
      });
    }
  };

  useEffect(
    () => {
      initialize();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // const createAcc = async (newName, newFirstLastname, newSecondLastname, newEmail, newPhone, newPassword) => {
  //   let response = await fetch(URI.sessions, {
  //     method: "POST",
  //     body: JSON.stringify({  }),
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     credentials: "include",
  //   });
  // };

  const signIn = async (email, password) => {
    let response = await fetch(URI.sessions, {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    let user;

    if (response.ok) {
      let userData = await response.json();

      if (userData.role == 2) throw new Error("Usuario no autorizado");

      user = userData;
      user.avatar = "/assets/logos/logo-ciis-xxiv.png";

      window.sessionStorage.setItem("authenticated", "true");
      window.sessionStorage.setItem("ciisTacnaAdmin", JSON.stringify(user));

      dispatch({
        type: HANDLERS.SIGN_IN,
        payload: user,
      });
    } else {
      if (response.status == 409) return signOut().then(() => signIn(email, password));

      let error = await response.json();
      console.log(error);

      throw new Error("Por favor revisa tu usuario y contraseña.");
    }
  };

  const signUp = async (email, name, password) => {
    throw new Error("Registro no implementado");
  };

  const signOut = async () => {
    window.sessionStorage.removeItem("ciisTacnaAdmin");
    window.sessionStorage.removeItem("authenticated");

    try {
      let response = await fetch(URI.sessions, {
        method: "DELETE",
        credentials: "include",
      });

      // dispatch({ type: HANDLERS.SIGN_OUT });
    } catch (err) {
      console.clear();
      console.error(err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        // createAcc,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);
