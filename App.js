import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Inicial from "./src/screens/Inicial";
import Login from "./src/screens/Login";
import Cadastro from "./src/screens/Cadastro";
import Home from "./src/screens/Home";
import Perfil from "./src/screens/Perfil";
import { Provider as PaperProvider } from "react-native-paper";
import Favoritos from "./src/screens/Favoritos";
import SobreNos from "./src/screens/SobreNos";
import Avaliacao from "./src/screens/Avaliacao";
import MapaScreen from "./src/screens/MapaScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Inicial" component={Inicial} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Cadastro" component={Cadastro} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Favoritos" component={Favoritos} />
          <Stack.Screen name="SobreNos" component={SobreNos} />
          <Stack.Screen name="Perfil" component={Perfil} />
          <Stack.Screen name="Avaliacao" component={Avaliacao} />
          <Stack.Screen name="MapaScreen" component={MapaScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
