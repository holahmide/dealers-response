import { createContext, useContext } from "react";
import { AppState } from "./interfaces";

export const AppContext = createContext<AppState>({} as AppState);

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error("useAppContext must be used within a AppProvider");
  }

  return context;
};
