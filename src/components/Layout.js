/* ---------- Ayuda!! ----------
 *    Layout de las pantallas
 */
//-Importaciones:
import {View, StyleSheet} from "react-native";
import React from "react";

//-Contenido:
const Layout = ({children}) => {
  return <View style={styles.container}>{children}</View>;
};

export default Layout;

//-Estilos:

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#30475E",
    flex: 1,
    padding: 15,
  },
});
