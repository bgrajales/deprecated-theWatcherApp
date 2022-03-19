import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { TabsNavigator } from './src/navigation/TabsNavigator';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';

const AppState = ({ children }: any) => {
 return (
  <AuthProvider>
    {children}
  </AuthProvider>
 )
}

export default function App() {
  return (
    <NavigationContainer>
      <AppState>
        <StatusBar 
          style="auto"
        />
        <TabsNavigator />
      </AppState>
    </NavigationContainer>
  );
}
