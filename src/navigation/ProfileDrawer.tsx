import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { ProfileComponent } from '../components/ProfileComponent';
import { PickGenresModal } from '../components/PickGenresModal';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';
import { DrawerActions } from '@react-navigation/native';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { About } from '../components/About';
import { WatchList } from '../components/WatchList';
import { Settings } from '../components/Settings';

const Drawer = createDrawerNavigator();

export const ProfileDrawer = () => {

    const { logOut, colorScheme} = useContext( AuthContext )

    return (
        <Drawer.Navigator
            initialRouteName="Profile"
            screenOptions={{
                headerShown: false,
                drawerPosition: 'right',
                sceneContainerStyle: {
                    backgroundColor: colorScheme === 'dark' ? '#121212' : '#fff'
                },
                drawerStyle: {
                    backgroundColor: colorScheme === 'dark' ? '#000' : '#fff'
                }
            }}
            drawerContent={props => {
                return (
                <DrawerContentScrollView {...props}>
                    <DrawerItem 
                        focused={props.state.index === 0}
                        label={({focused}) => (
                            <Text style={{ 
                                color: focused ? '#fff' : colorScheme === 'dark' ? '#fff' : '#000', 
                                fontWeight: focused ? 'bold' : 'normal',
                            }}>
                                Profile
                            </Text>
                        )}
                        onPress={() => props.navigation.navigate('Profile')}
                        icon={({focused}) => <Icon name="md-person" size={24} color={
                            focused ? '#fff' : colorScheme === 'dark' ? '#fff' : '#292929'
                        }/>}
                        activeBackgroundColor="#0055ff"
                    />
                    <DrawerItem 
                         label={({focused}) => (
                            <Text style={{ 
                                color: focused ? '#fff' : colorScheme === 'dark' ? '#fff' : '#000', 
                                fontWeight: focused ? 'bold' : 'normal',
                            }}>
                                Genres
                            </Text>
                        )}
                        labelStyle={{ color: '#292929' }}
                        onPress={() => props.navigation.navigate('Genres')}
                        icon={({focused}) => <Icon name="md-heart" size={24} color={
                            focused ? '#fff' : colorScheme === 'dark' ? '#fff' : '#292929'
                        }/>}
                        focused={props.state.index === 1}
                        activeBackgroundColor="#0055ff"
                    />
                    <DrawerItem 
                         label={({focused}) => (
                            <Text style={{ 
                                color: focused ? '#fff' : colorScheme === 'dark' ? '#fff' : '#000', 
                                fontWeight: focused ? 'bold' : 'normal',
                            }}>
                                Watchlist
                            </Text>
                        )}
                        labelStyle={{ color: '#292929' }}
                        onPress={() => props.navigation.navigate('Watchlist')}
                        icon={({focused}) => <Icon name="bookmark" size={24} color={
                            focused ? '#fff' : colorScheme === 'dark' ? '#fff' : '#292929'
                        }/>}
                        focused={props.state.index === 2}
                        activeBackgroundColor="#0055ff"
                    />  
                    <DrawerItem 
                         label={({focused}) => (
                            <Text style={{ 
                                color: focused ? '#fff' : colorScheme === 'dark' ? '#fff' : '#000', 
                                fontWeight: focused ? 'bold' : 'normal',
                            }}>
                                About / Features
                            </Text>
                        )}
                        labelStyle={{ color: '#292929' }}
                        onPress={() => props.navigation.navigate('About')}
                        icon={({focused}) => <Icon name="information-circle" size={24} color={
                            focused ? '#fff' : colorScheme === 'dark' ? '#fff' : '#292929'
                        }/>}
                        focused={props.state.index === 3}
                        activeBackgroundColor="#0055ff"
                    /> 
                    <DrawerItem 
                         label={({focused}) => (
                            <Text style={{ 
                                color: focused ? '#fff' : colorScheme === 'dark' ? '#fff' : '#000', 
                                fontWeight: focused ? 'bold' : 'normal',
                            }}>
                                Settings
                            </Text>
                        )}
                        labelStyle={{ color: '#292929' }}
                        onPress={() => props.navigation.navigate('Settings')}
                        icon={({focused}) => <Icon name="settings" size={24} color={
                            focused ? '#fff' : colorScheme === 'dark' ? '#fff' : '#292929'
                        }/>}
                        focused={props.state.index === 4}
                        activeBackgroundColor="#0055ff"
                    /> 
                    <DrawerItem 
                        label={ () =>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'red'}}>
                                    Logout
                            </Text>
                        }
                        icon={() =>
                            <Icon name="log-out" size={24} color="red"/>
                        }
                        onPress={() => {
                            logOut()
                            props.navigation.dispatch(DrawerActions.closeDrawer())
                        }}
                    />
                </DrawerContentScrollView>
                )
            }}
        >
            <Drawer.Screen name="Profile" component={ProfileComponent}/>
            <Drawer.Screen name="Genres" component={PickGenresModal} />
            <Drawer.Screen name="Watchlist" component={WatchList} />
            <Drawer.Screen name="About" component={About} />
            <Drawer.Screen name="Settings" component={Settings} />
        </Drawer.Navigator>
    );
}