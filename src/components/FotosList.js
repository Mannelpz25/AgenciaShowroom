/* ---------- Ayuda!! ----------
 * Lista de fotos
 */
//-Importaciones:
import {
  Alert,
  FlatList,
  Image,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import React, {useContext, useEffect, useState} from "react";
import {CarsContext} from "../hooks/CarsContext";

//-Contenido:
const FotosList = () => {
  const [cars, setCars] = useContext(CarsContext);
  const [fotos, setFotos] = useState(cars.active.fotos);

  useEffect(() => {
    setFotos(cars.active.fotos);
  }, [cars]);

  const handleDelete = uri => {
    Alert.alert("Eliminar foto", "¿Desea eliminar esta foto?", [
      {
        text: "No",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Si",
        onPress: () => {
          const newFotos = fotos.filter(foto => foto.uri !== uri);
          setCars({...cars, active: {...cars.active, fotos: newFotos}});
        },
      },
    ]);
  };
  return (
    <View style={styles.centeredView}>
      {fotos && Object.values(fotos).length > 0 ? (
        <FlatList
          style={styles.container}
          numColumns={2}
          data={fotos}
          keyExtractor={item => item.uri}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                style={styles.cardImage}
                onLongPress={() => handleDelete(item.uri)}
              >
                <Image
                  resizeMode="cover"
                  resizeMethod="scale"
                  style={{width: "100%", height: 180}}
                  source={{uri: item.uri}}
                />
              </TouchableOpacity>
            );
          }}
        />
      ) : (
        <View>
          <Text style={styles.textH2}>Sin Fotos</Text>
          <Text style={styles.textP}>Agrega una nueva foto</Text>
        </View>
      )}
    </View>
  );
};

export default FotosList;

//-Estilos:
const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  cardImage: {
    display: "flex",
    width: "49.5%",
    margin: 2,
    justifyContent: "space-between",
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
  centeredView: {
    height: "93%",
    justifyContent: "flex-start",
    alignItems: "center",
  },
});
