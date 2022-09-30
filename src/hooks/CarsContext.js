import React, {useState, createContext} from "react";

export const CarsContext = createContext();

export const CarsProvider = ({children}) => {
  const [cars, setCars] = useState({
    cars: [],
    active: null,
  } );
  /*
    {
      id: "",
      marca: "",
      modelo: "",
      serie: "",
      año: "",
      color: "",
      placas: "",
      fotos: []
    }
  */
  return (
    <CarsContext.Provider value={[cars, setCars]}>
      {children}
    </CarsContext.Provider>
  );
};
