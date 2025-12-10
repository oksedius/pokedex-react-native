import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { PokemonDetailScreen } from "../screens/PokemonDetailScreen";
import { PokemonListScreen } from "../screens/PokemonListScreen";
import { RootStackParamList } from "../types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="PokemonList" component={PokemonListScreen} />
      <Stack.Screen name="PokemonDetail" component={PokemonDetailScreen} />
    </Stack.Navigator>
  );
};
