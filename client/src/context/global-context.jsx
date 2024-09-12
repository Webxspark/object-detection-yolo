import { Toaster } from '@/components/ui/sonner';
import { toast } from "sonner"
import { createContext } from 'react';

const GlobalContext = createContext({
    utils: {
        toast: () => { }
    }
})

const GlobalContextProvider = ({ children }) => {
    var output = {
        utils: {
            toast
        }
    }
    return (
        <GlobalContext.Provider value={output}>
            {children}
            <Toaster closeButton />
        </GlobalContext.Provider>
    )
}

export { GlobalContext, GlobalContextProvider }