/* ---------- Ayuda!! ----------
*    Pantalla de fotos
*/
//-Importaciones:
import { View, Text, Image,TouchableOpacity, StyleSheet, PermissionsAndroid } from 'react-native'
import React, { useCallback, useState } from 'react'
import Layout from '../components/Layout'
import {launchImageLibrary, launchCamera} from 'react-native-image-picker'


//-Contenido:
const FotosScreen = () => {
  const [response, setResponse] = useState(null);
  const onImageLibraryPress = useCallback(() => {
    const options = {
      selectionLimit: 1,
      mediaType: 'photo',
      includeBase64: false,
    };
    launchImageLibrary(options, setResponse);
  }, []);
  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "App Camera Permission",
          message:"App needs access to your camera ",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      const grantedGallery = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "App Gallery Permission",
          message:"App needs access to your photos",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED && grantedGallery === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Camera permission given");
        launchCamera({mediaType: 'photo', saveToPhotos: true}, setResponse)
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  }

  return (
    <Layout>
      <TouchableOpacity style={styles.button} onPress={onImageLibraryPress}>
        <Text style={styles.textButton}>Galeria</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={requestCameraPermission}>
        <Text style={styles.textButton}>Camara</Text>
      </TouchableOpacity>
      <View >
          {response?.assets &&
                response?.assets.map(({ uri }) => (
                    <View key={uri} style={styles.image}>
                        <Image
                            resizeMode="cover"
                            resizeMethod="scale"
                            style={{ width: 200, height: 200 }}
                            source={{ uri: uri }}
                        />
                    </View>
                ))}
      </View>
    </Layout>
  )
}

export default FotosScreen

//-Estilos:
const styles = StyleSheet.create({
  
  button: {
    color: "#041C32",
    borderRadius: 10,
    marginTop: 10,
    backgroundColor: "#ECB365",
    padding: 10,
    width: "85%",
  },
  textButton: {
    color: "#041C32",
    textAlign: "center",
    fontSize: 16,
    fontStyle: "bold",
  },
});
