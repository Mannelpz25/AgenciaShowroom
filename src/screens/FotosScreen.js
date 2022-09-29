/* ---------- Ayuda!! ----------
 *    Pantalla de fotos
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
  Alert,
  Pressable,
} from "react-native";
import React, {useCallback, useEffect, useState} from "react";
import Layout from "../components/Layout";
import {launchImageLibrary, launchCamera} from "react-native-image-picker";

//-Contenido:
const FotosScreen = ({navigation}) => {
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
    <Layout>
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
              <TouchableOpacity style={[styles.button]} onPress={onImageLibraryPress}>
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
      <View>
      {response?.assets &&
          response?.assets.map(({uri}) => (
            <View key={uri} style={styles.image}>
              <Image
                resizeMode="cover"
                resizeMethod="scale"
                style={{width: 200, height: 200}}
                source={{uri: uri}}
              />
            </View>
          ))}
        <TouchableOpacity
          style={[styles.button]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.textStyle}>Agregar Foto</Text>
        </TouchableOpacity>        
      </View>
    </Layout>
  );
};

export default FotosScreen;

//-Estilos:
const styles = StyleSheet.create({
  newFotoButton: {
    color: "#041C32",
    borderRadius: 15,
    paddingVertical: 2,
    paddingHorizontal: 10,
    backgroundColor: "#DDDDDD",
    fontSize: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: '90%',
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
    width: '90%',
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
