/* ---------- Ayuda!! ----------
 *    Pantalla Home
 */
//-Importaciones:
import {StyleSheet, Text, View} from "react-native";
import React, {useContext, useEffect} from "react";
import Layout from "../components/Layout";
import CarList from "../components/CarList";
import {CarsContext} from "../hooks/CarsContext";
import {clearStorage, getData} from "../storage/AsyncStorage";

//-Contenido:
const HomeScreen = () => {
  const [cars, setCars] = useContext(CarsContext);

  const getCars = async () => {
    await setCars({...cars, cars: await getData()});
  };

  useEffect(() => {
    getCars();
    setCars({...cars, active: null});
  }, []);

  return (
    <Layout>
      {cars.cars && Object.values(cars.cars).length > 0 ? (
        <CarList cars={cars.cars} />
      ) : (
        <View style={styles.centeredView}>
          <Text style={styles.textH2}>Sin vehículos</Text>
          <Text style={styles.textP}>Agrega un nuevo vehículo</Text>
        </View>
      )}
    </Layout>
  );
};

export default HomeScreen;

//-Estilos:
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textH2: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
  },
  textP: {
    color: "#c7c7c7",
    fontWeight: "normal",
    textAlign: "center",
    fontSize: 14,
  },
});
