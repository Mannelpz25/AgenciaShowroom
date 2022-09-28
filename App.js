/* ---------- Ayuda!! ----------
 *    Archivo principal de la APP
 */
//-Importaciones:
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {
  StatusBar,
  BackHandler,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CarScreen from "./src/screens/CarScreen";
import HomeScreen from "./src/screens/HomeScreen";
import FotosScreen from "./src/screens/FotosScreen";
import {CarProvider} from "./src/hooks/CarContext";

//-Contenido:
const Stack = createNativeStackNavigator();
export default function App() {
  // Función para cerrar la app
  const exit = () => {
    BackHandler.exitApp();
  };

  return (
    <CarProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={({navigation}) => ({
              headerRight: () => (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => navigation.navigate("CarScreen")}
                    style={{marginRight: 15}}
                  >
                    <Text style={styles.newButton}>Nuevo</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={exit}>
                    <Text style={styles.exitButton}>Salir</Text>
                  </TouchableOpacity>
                </View>
              ),
              title: "Agencia Show Room",
              headerTitleStyle: {
                color: "#787A91",
                fontWeight: "bold",
              },
              headerStyle: {
                backgroundColor: "#041C32",
              },
            })}
          />
          <Stack.Screen
            name="CarScreen"
            component={CarScreen}
            options={({navigation}) => ({
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => navigation.navigate("FotosScreen")}
                  style={{marginRight: 15}}
                >
                  <Text style={styles.fotosButton}>Fotos</Text>
                </TouchableOpacity>
              ),
              title: "Nuevo vehículo",
              headerTitleStyle: {
                color: "#787A91",
              },
              headerStyle: {
                backgroundColor: "#041C32",
              },
              headerTintColor: "#787A91",
            })}
          />
          <Stack.Screen
            name="FotosScreen"
            component={FotosScreen}
            options={{
              title: "Fotos",
              headerTitleStyle: {
                color: "#787A91",
              },
              headerStyle: {
                backgroundColor: "#041C32",
              },
              headerTintColor: "#787A91",
            }}
          />
        </Stack.Navigator>
        <StatusBar barStyle={"ligth-content"} backgroundColor={"#041C32"} />
      </NavigationContainer>
    </CarProvider>
  );
}

//-Estilos:
const styles = StyleSheet.create({
  exitButton: {
    color: "#F05454",
    fontSize: 16,
    padding: 2,
  },
  newButton: {
    color: "#041C32",
    borderRadius: 15,
    paddingVertical: 2,
    paddingHorizontal: 10,
    backgroundColor: "#ECB365",
    fontSize: 16,
    fontWeight: "bold",
  },
  fotosButton: {
    color: "#041C32",
    borderRadius: 15,
    paddingVertical: 2,
    paddingHorizontal: 10,
    backgroundColor: "#DDDDDD",
    fontSize: 16,
  },
});
