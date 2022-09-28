/* ---------- Ayuda!! ----------
 *    Pantalla de vehículo
 */
//-Importaciones:
import {
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import React, {useContext, useEffect, useState} from "react";
import Layout from "../components/Layout";
import {CarContext} from "../hooks/CarContext";
import {storeData} from "../storage/AsyncStorage";

//-Contenido:
const CarScreen = ({navigation, route}) => {
  // constante para deshabilitar el botón Guardar
  const [disabled, setDisabled] = useState(true);

  //Context de la lista de vehículos
  const [cars, setCars] = useContext(CarContext);

  //Estado para el llenado de vehículo del formulario
  const [car, setCar] = React.useState({
    id: "",
    marca: "",
    modelo: "",
    serie: "",
    año: "",
    color: "",
    placas: "",
  });

  //Efecto para cambiar el título de la navegación si es una edición de vehículo
  useEffect(() => {
    if (route.params && route.params.car) {
      navigation.setOptions({headerTitle: "Editar vehículo"});
      setCar(route.params.car);
    }
  }, []);

  //Efecto para cambiar el estado de la constante disabled
  useEffect(() => {
    if (
      car.marca.length > 1 &&
      car.modelo.length > 1 &&
      car.serie.length === 16 &&
      car.año.length == 4
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [car]);

  //HandleChange
  const handleChange = (name, value) => {
    setCar({...car, [name]: value});
  };

  //HandleSubmit
  const handleSubmit = async () => {
    if (route.params && route.params.car) {
      const listCars = cars.map(carItem => {
        if (carItem.id === car.id) {
          return car;
        }
        return carItem;
      });
      setCars(listCars);
      storeData(listCars);
    } else {
      newId =
        car.marca.substring(0, 2).toUpperCase() +
        car.modelo.substring(0, 2).toUpperCase() +
        car.año +
        Math.floor(Math.random() * 10) +
        Math.floor(Math.random() * 10);

      if (cars) {
        const listCars = [...cars, {...car, id: newId}];
        setCars(listCars);
        await storeData(listCars);
      } else {
        const listCars = [{...car, id: newId}];
        setCars(listCars);
        await storeData(listCars);
      }
    }
    navigation.navigate("HomeScreen");
  };

  //HandleDelete
  const handleDelete = async () => {
    const listCars = cars.filter(carItem => carItem.id !== car.id);
    setCars(listCars);
    await storeData(listCars);
    navigation.navigate("HomeScreen");
  };

  return (
    <Layout>
      <TextInput
        style={styles.input}
        placeholder="Marca*"
        placeholderTextColor="#808080"
        onChangeText={text => handleChange("marca", text)}
        value={car.marca}
        returnKeyType={"next"}
      />
      <TextInput
        style={styles.input}
        placeholder="Modelo*"
        placeholderTextColor="#808080"
        onChangeText={text => handleChange("modelo", text)}
        value={car.modelo}
        returnKeyType={"next"}
      />
      <TextInput
        style={styles.input}
        placeholder="Serie*"
        placeholderTextColor="#808080"
        onChangeText={text => handleChange("serie", text)}
        value={car.serie.toLocaleUpperCase()}
        maxLength={16}
        returnKeyType={"next"}
      />
      <TextInput
        style={styles.input}
        placeholder="Año*"
        placeholderTextColor="#808080"
        onChangeText={text => handleChange("año", text)}
        value={car.año}
        keyboardType="numeric"
        maxLength={4}
        returnKeyType={"next"}
      />
      <TextInput
        style={styles.input}
        placeholder="Color"
        placeholderTextColor="#808080"
        onChangeText={text => handleChange("color", text)}
        value={car.color}
        returnKeyType={"next"}
      />
      <TextInput
        style={styles.input}
        placeholder="Placas"
        placeholderTextColor="#808080"
        onChangeText={text => handleChange("placas", text)}
        value={car.placas}
        returnKeyType={"done"}
      />
      <TouchableOpacity
        style={[styles.saveButton, disabled && styles.saveButtonDisable]}
        disabled={disabled}
        onPress={handleSubmit}
      >
        <Text style={styles.textButton}>Guardar</Text>
      </TouchableOpacity>
      {route.params && (
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.textButton}>Eliminar</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => navigation.navigate("HomeScreen")}
      >
        <Text style={styles.textButton}>Cancelar</Text>
      </TouchableOpacity>
    </Layout>
  );
};

export default CarScreen;

//-Estilos:
const styles = StyleSheet.create({
  input: {
    backgroundColor: "#DDDDDD",
    width: "95%",
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#041C32",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    textAlign: "center",
    color: "#041C32",
  },
  saveButtonDisable: {
    color: "#041C32",
    borderRadius: 10,
    marginTop: 10,
    backgroundColor: "#ECB365",
    padding: 10,
    width: "85%",
    opacity: 0.4,
  },
  saveButton: {
    color: "#041C32",
    borderRadius: 10,
    marginTop: 10,
    backgroundColor: "#ECB365",
    padding: 10,
    width: "85%",
  },
  deleteButton: {
    color: "#DDDDDD",
    borderRadius: 10,
    marginTop: 8,
    backgroundColor: "#B22222",
    padding: 10,
    width: "85%",
  },
  cancelButton: {
    color: "#DDDDDD",
    borderRadius: 10,
    marginTop: 8,
    backgroundColor: "#F05454",
    padding: 10,
    width: "85%",
  },
  textButton: {
    color: "#041C32",
    textAlign: "center",
    fontSize: 16,
    fontStyle: "bold",
  },
  errorText: {
    color: "#F05454",
    textAlign: "center",
    fontSize: 10,
  },
});
