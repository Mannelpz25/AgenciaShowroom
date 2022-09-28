/* ---------- Ayuda!! ----------
 *    Pantalla Home
 */
//-Importaciones:
import {StyleSheet} from "react-native";
import React, {useContext, useEffect} from "react";
import Layout from "../components/Layout";
import CarList from "../components/CarList";
import {CarContext} from "../hooks/CarContext";
import {clearStorage, getData} from "../storage/AsyncStorage";

//-Contenido:
const HomeScreen = () => {
  const [cars, setCars] = useContext(CarContext);

  const getCars = async () => {
    await setCars(await getData());
  };

  useEffect(() => {
    getCars();
  }, []);

  return (
    <Layout>
      <CarList cars={cars} />
    </Layout>
  );
};

export default HomeScreen;

//-Estilos:
const styles = StyleSheet.create({
  cancelButton: {
    color: "#DDDDDD",
    borderRadius: 15,
    paddingVertical: 2,
    paddingHorizontal: 10,
    backgroundColor: "#F05454",
    fontSize: 16,
    padding: 2,
  },
  saveButton: {
    color: "#041C32",
    borderRadius: 15,
    paddingVertical: 2,
    paddingHorizontal: 10,
    backgroundColor: "#ECB365",
    fontSize: 16,
    fontWeight: "bold",
  },
});
