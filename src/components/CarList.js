/* ---------- Ayuda!! ----------
 *    Lista de vehículos
 */
//-Importaciones:
import {FlatList, Text, TouchableOpacity, StyleSheet} from "react-native";
import React from "react";
import {useNavigation} from "@react-navigation/native";

//-Contenido:
const CarList = ({cars}) => {
  const navigation = useNavigation();
  return (
    <FlatList
      style={styles.container}
      data={cars}
      keyExtractor={item => item.id}
      renderItem={({item}) => {
        return (
          <TouchableOpacity
            style={styles.carItem}
            onPress={() => navigation.navigate("CarScreen", {car: item})}
          >
            <Text style={styles.textMarca}> {item.marca}</Text>
            <Text style={styles.textModelo}> {item.modelo} </Text>
            <Text style={styles.textAño}> {item.año} </Text>
          </TouchableOpacity>
        );
      }}
    />
  );
};

export default CarList;

//-Estilos:
const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  carItem: {
    flexDirection: "row",
    color: "#DDDDDD",
    borderRadius: 10,
    backgroundColor: "#DDDDDD",
    padding: 10,
    margin: 5,
    justifyContent: "center",
  },
  textMarca: {
    color: "#041C32",
    textAlign: "center",
    fontSize: 18,
    fontStyle: "bold",
  },
  textModelo: {
    color: "#041C32",
    textAlign: "center",
    fontSize: 18,
    fontStyle: "normal",
  },
  textAño: {
    color: "#041C32",
    textAlignVertical: "center",
    textAlign: "center",
    fontSize: 16,
    fontStyle: "italic",
  },
});
