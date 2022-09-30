/* ---------- Ayuda!! ----------
 *    Archivo para manejar el Storage Local
 */
//-Importaciones:
import AsyncStorage from "@react-native-async-storage/async-storage";
//-Contenido:

//Función para guardar Json en memoria del teléfono
const storeData = async cars => {
  try {
    const jsonValue = JSON.stringify(cars);
    await AsyncStorage.setItem("@Cars", jsonValue);
  } catch (e) {
    // saving error
  }
};

//Función para leer Json en memoria desde teléfono
const getData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("@Cars");
    return jsonValue != null && jsonValue != [] ? JSON.parse(jsonValue) : null;
  } catch (e) {
    // error reading value
  }
};
//Función para borrar el AsyncStorage
const clearStorage = async () => {
  try {
    await AsyncStorage.clear();
    alert("Borrado Correcto!");
  } catch (e) {
    alert("Error al intentar borrar");
  }
};
export {storeData, getData, clearStorage};
//-Estilos:
