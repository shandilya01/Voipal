import { createContext, useState } from "react";
export const AppContext = createContext()

export function AppContextProvider({children}){
    const [params,setParams] = useState({})

    return (
        <AppContext.Provider value={{params,setParams}}>
            {children}
        </AppContext.Provider>
    )
}