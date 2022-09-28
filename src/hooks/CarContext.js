import React, {useState, createContext} from "react";

export const CarContext = createContext();

export const CarProvider = ({children}) => {
  const [cars, setCars] = useState(null);
  return (
    <CarContext.Provider value={[cars, setCars]}>
      {children}
    </CarContext.Provider>
  );
};
