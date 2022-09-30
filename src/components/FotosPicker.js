/* ---------- Ayuda!! ----------
 *  Componente para seleccionar una nueva foto
 */
//-Importaciones:
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  PermissionsAndroid,
  Modal,
} from "react-native";
import React, {useCallback, useContext, useEffect, useState} from "react";
import {launchImageLibrary, launchCamera} from "react-native-image-picker";
import {CarsContext} from "../hooks/CarsContext";
import FotosList from "./FotosList";

//-Contenido:
const FotosPicker = () => {
  //Context de la lista de vehículos
  const [cars, setCars] = useContext(CarsContext);
  const [response, setResponse] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const onImageLibraryPress = useCallback(() => {
    const options = {
      selectionLimit: 1,
      mediaType: "photo",
      includeBase64: false,
    };
    launchImageLibrary(options, setResponse);
    setModalVisible(false);
  }, []);

  useEffect(() => {
    if (response && response.assets) {
      setCars({
        ...cars,
        active: {
          ...cars.active,
          fotos: [...cars.active.fotos, response.assets[0]],
        },
      });
    }
  }, [response]);

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "App Camera Permission",
          message: "App needs access to your camera ",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        },
      );
      const grantedGallery = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "App Gallery Permission",
          message: "App needs access to your photos",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        },
      );
      if (
        granted === PermissionsAndroid.RESULTS.GRANTED &&
        grantedGallery === PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log("Camera permission given");
        launchCamera({mediaType: "photo", saveToPhotos: true}, setResponse);
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
    setModalVisible(false);
  };

  return (
    <View style={styles.View}>
      <FotosList />
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Seleccione una opción</Text>
              <TouchableOpacity
                style={[styles.button]}
                onPress={onImageLibraryPress}
              >
                <Text style={styles.textStyle}>Galería</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button]}
                onPress={requestCameraPermission}
              >
                <Text style={styles.textStyle}>Cámara</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>

      <TouchableOpacity
        style={[styles.button]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.textStyle}>Agregar Foto</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FotosPicker;

//-Estilos:
const styles = StyleSheet.create({
  View: {
    width: "100%",
    flex: 1,
  },
  centeredView: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: "90%",
    backgroundColor: "#DDDDDD",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#041C32",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    width: "100%",
    borderRadius: 20,
    padding: 10,
    margin: 4,
    elevation: 2,
    backgroundColor: "#ECB365",
  },
  textStyle: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    color: "#041C32",
    marginBottom: 15,
    textAlign: "center",
  },
});
