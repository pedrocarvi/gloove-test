import React, { createContext, useReducer, useContext, ReactNode } from "react";

interface FormDataState {
  formData: any;
}

interface GlobalContextProps {
  state: FormDataState;
  dispatch: React.Dispatch<any>;
}

interface GlobalProviderProps {
  children: ReactNode;
}

const initialState: FormDataState = {
  formData: {},
};

const reducer = (state: FormDataState, action: any): FormDataState => {
  switch (action.type) {
    case "SET_FORM_VALUES":
      return {
        ...state,
        formData: { ...state.formData, ...action.payload },
      };
    default:
      return state;
  }
};

const GlobalContext = createContext<GlobalContextProps>({
  state: initialState,
  dispatch: () => null,
});

export const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
