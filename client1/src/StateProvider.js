import React, { createContext, useContext, useReducer } from 'react'

// PREPARES THE DATA LAYER
export const StateContext = createContext()

//WRAPS OUR APP AND PROVIDE THE DATA LAYER TO EACH COMPONENT
export const StateProvider = ({reducer , initialState , children}) => (
    <StateContext.Provider value = {useReducer(reducer , initialState)}>
        {children}
    </StateContext.Provider>
    )

//USED TO PULL INFORMATION
export const useStateValue = () => useContext(StateContext)