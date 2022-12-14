/* ---------- Ayuda!! ----------
 *    Pantalla de vehículo
 */
//-Importaciones:
import {
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, {useContext, useEffect, useState} from "react";
import Layout from "../components/Layout";
import {CarsContext} from "../hooks/CarsContext";
import {storeData} from "../storage/AsyncStorage";
import DateTimePicker from '@react-native-community/datetimepicker';


//-Contenido:
const CarScreen = ({navigation, route}) => {
  // constante para deshabilitar el botón Guardar
  const [disabled, setDisabled] = useState(true);
  //Context de la lista de vehículos
  const [cars, setCars] = useContext(CarsContext);

  const [show, setShow] = useState(false);

  const [selectedDate, setSelectedDate] = useState('');

  //Estado para el llenado de vehículo del formulario
  const [car, setCar] = React.useState({
    id: "",
    marca: "",
    modelo: "",
    serie: "",
    año: "",
    color: "",
    placas: "",
    fotos: [],
  });

  //Efecto para cambiar el título de la navegación si es una edición de vehículo
  useEffect(() => {
    if (route.params && route.params.car) {
      navigation.setOptions({headerTitle: "Editar vehículo"});
      setCars({...cars, active: route.params.car});
      setCar(route.params.car);
    } else {
      setCars({...cars, active: car});
    }
  }, []);

  //Efecto para cambiar el estado de la constante disabled
  useEffect(() => {
    if (
      car.marca.length > 1 &&
      car.modelo.length > 0 &&
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
      const listCars = cars.cars.map(carItem => {
        if (carItem.id === car.id) {
          car.fotos = cars.active.fotos;
          return car;
        }
        return carItem;
      });
      setCars({...cars, cars: listCars});
      storeData(listCars);
    } else {
      newId =
        car.marca.substring(0, 2).toUpperCase() +
        car.modelo.substring(0, 1).toUpperCase() +
        car.año +
        Math.floor(Math.random() * 10) +
        Math.floor(Math.random() * 10) +
        Math.floor(Math.random() * 10) +
        Math.floor(Math.random() * 10);

      if (cars.cars) {
        const listCars = [
          ...cars.cars,
          {...car, id: newId, fotos: cars.active.fotos},
        ];
        setCars({...cars, cars: listCars});
        await storeData(listCars);
      } else {
        const listCars = [{...car, id: newId, fotos: cars.active.fotos}];
        setCars({...cars, cars: listCars});
        await storeData(listCars);
      }
    }
    navigation.navigate("HomeScreen");
  };

  //HandleDelete
  const handleDelete = async () => {
    const listCars = cars.cars.filter(carItem => carItem.id !== car.id);
    setCars({...cars, cars: listCars});
    await storeData(listCars);
    navigation.navigate("HomeScreen");
  };

  return (
    <Layout>
      

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => setShow(true)}
      >
        <Text style={styles.textButton}>Cancelar</Text>
      </TouchableOpacity>
      {show && (
       <DateTimePicker
        value={new Date()}
        display="spinner"
        themeVariant="light"
        mode="time"
        positiveButton={{label: 'Aceptar', textColor: 'green'}}
        negativeButton={{label: 'Cancelar', textColor: 'red'}}
        is24Hour={false}
        style={{flex: 1,  paddingTop: 10,
          width: 350, borderRadius: 100,}}
        onChange={()=>{}}
       />
       )}

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
