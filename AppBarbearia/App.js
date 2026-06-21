import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Inicial from "./Telas/inicial";
import Login from "./Telas/Login";
import Cadastro from "./Telas/Cadastro";
import Home from "./Telas/Home";
import Agendar from "./Telas/Agendamento";
import Catalogo from "./Telas/Cortes";
import Contato from "./Telas/Contato";
import BarbeiroLogin from "./Telas/BarbeiroLogin";
import BarbeiroDashboard from "./Telas/BarbeiroDashboard";

export default function App() {

  const Stack = createStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator 
      initialRouteName="Inicial"
      screenOptions={{
          headerShown: false,
      }}>
        <Stack.Screen name="Inicial" component={Inicial}/>
        <Stack.Screen name="Login" component={Login}/>
        <Stack.Screen name="Cadastro" component={Cadastro}/>
        <Stack.Screen name="goHome" component={Home}/>
        <Stack.Screen name="Agendar" component={Agendar}/>
        <Stack.Screen name="Catalogo" component={Catalogo}/>
        <Stack.Screen name="Contato" component={Contato}/>
        <Stack.Screen name="BarbeiroLogin" component={BarbeiroLogin}/>
        <Stack.Screen name="BarbeiroDashboard" component={BarbeiroDashboard}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}