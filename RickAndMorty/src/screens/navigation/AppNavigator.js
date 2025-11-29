import { createStackNavigator } from '@react-navigation/stack';
import CharactersListScreen from '../CharactersListScreen';
import CharacterDetailScreen from '../CharacterDetailScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Characters" 
        component={CharactersListScreen}
        options={{ title: 'Rick and Morty Characters' }}
      />
      <Stack.Screen 
        name="Details" 
        component={CharacterDetailScreen}
        options={{ title: 'Character Details' }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;